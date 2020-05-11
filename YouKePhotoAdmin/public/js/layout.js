
$(function () {
    Layout.init();
})

var Layout = {
    layoutTpl: `{{each NoticeList as value i}}
        <li class="clearfix">
            <p class="info-text">{{NoticeList[i].Body}}</p>
            <p class="info-time">{{NoticeList[i].AddTime | convertNotificationTime}}</p>
            <img class="info-read" src="/public/images/true.png" data-nid={{NoticeList[i].NId}}>
        </li>
    {{/each}}`,
    sidebarTpl:
    "{{each PermissionsList as value i}}" +
    "<li class='{{PermissionsList[i].Action | selectFirstSide}}'>" +
    "<a href='{{PermissionsList[i].Action | selectFirstUrl}}'>" +
    "<i class='{{PermissionsList[i].IconClass == '' ? 'icon-yingyong' : PermissionsList[i].IconClass }}'></i>" +
    "<span>{{PermissionsList[i].Title}}</span>" +
    "{{if PermissionsList[i].ChildList.length>0}}" +
    "<span class='pull-right-container'>" +
    "<i class='fa fa-angle-left pull-right'></i>" +
    "</span>" +
    "{{/if}}" +
    "</a>" +
    "{{if PermissionsList[i].ChildList.length>0}}" +
    "<ul class='treeview-menu'>" +
    "{{each PermissionsList[i].ChildList as value j}}" +
    "<li class='{{PermissionsList[i].ChildList[j].Action | selectSecondSide}}' >" +
    "<a href='{{PermissionsList[i].ChildList[j].Action}}'>" +
    "<i class='fa fa-circle-o'></i>" +
    "<span>{{PermissionsList[i].ChildList[j].Title}}</span>" +
    "</a>" +
    "</li>" +
    "{{/each}}" +
    "</ul>" +
    "{{/if}}" +
    "</li>" +
    "{{/each}}",
    storeSideBarTpl: `
        <li class=" treeview {{'/' | selectFirstSide}}">
        <a href="{{'/' | selectFirstUrl}}">
            <i class="iconfont icon-shouye"></i>
            <span>首页</span>
        </a>
        </li>
        <li class="treeview {{'/order/' | selectFirstSide}}">
        <a href="#">
            <i class="iconfont icon-dingdan"></i>
            <span>订单管理</span>
            <span class="pull-right-container">
            <i class="fa fa-angle-left pull-right"></i>
            </span>
        </a>
        <ul class="treeview-menu">
            <li class="{{'/order/orderDepartmentList' | selectSecondSide}}">
                <a href="/order/orderDepartmentList">
                    <i class="fa fa-circle-o"></i>
                    <span>百货订单列表</span>
                </a>
            </li>
            <li class="{{'/order/orderServiceList' | selectSecondSide}}">
                <a href="/order/orderServiceList">
                    <i class="fa fa-circle-o"></i>
                    <span>服务订单列表</span>
                </a>
            </li>
            <li class="{{'/order/orderService' | selectSecondSide}}">
                <a href="/order/orderService">
                    <i class="fa fa-circle-o"></i>
                    <span>售后服务</span>
                </a>
            </li>
            <li class="{{'/order/refundApplication' | selectSecondSide}}">
                <a href="/order/refundApplication">
                    <i class="fa fa-circle-o"></i>
                    <span>退款申请单</span>
                </a>
            </li>
        </ul>
    </li>                                            
    `,
    init: function () {
        //辅助函数（侧边栏选中）
        template.defaults.imports.selectFirstUrl = Common.selectFirstUrl;
        template.defaults.imports.selectSecondSide = Common.selectSecondSide;
        template.defaults.imports.selectFirstSide = Common.selectFirstSide;

        //加载左侧菜单列表
        Layout.adminPermissionsList();

        $('body').on("click", '#logout', function () {
            Layout.logout();
        });

        //标记已读
        $("#infoList").on("click", ".info-read", function () {
            var nid = $(this).attr("data-nid");
            Layout.updateIsRead(nid);
        });

        //标记全部已读
        $("#markAll").on("click", function () {
            Layout.updateAllIsRead();
        });

        //给页面图片添加error
        $("#userImg-small,#userImg-big,#userImg-mid").on("error", function () {
            $(this).attr("src", "/public/dist/img/user2-160x160.jpg");
        });


        //使用辅助函数
        template.defaults.imports.convertNotificationTime = Common.convertNotificationTime;

        Layout.initUserInfo();

        if (localStorage.getItem('token') != null && localStorage.getItem('token') != '') {
            // Layout.getIsNewOrder();
            window.setInterval("Layout.timeActionWithOrder()", 10000);
        }
    },
    //定时获取是否存在新的订单、刷新通知列表
    timeActionWithOrder: function () {
        // Layout.getIsNewOrder();
    },
    //是否有新的订单通知
    getIsNewOrder: function () {
        var methodName = "/notice/AdminNotSignNoticeList";
        var data = {};
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                if (data.Data.Total > 0) {
                    //获取订单提醒音频对象
                    var audio = document.getElementById("audio");
                    audio.play();
                    Layout.getInformationList();
                }
            } else {
                // Common.showErrorMsg(data.Message);
            }
        }, null, true);

    },
    //加载用户头像昵称信息
    initUserInfo: function () {
        $("#userImg-small").attr("src", localStorage.Avatar);
        $("#userImg-big").attr("src", localStorage.Avatar);
        $("#userImg-mid").attr("src", localStorage.Avatar);
        $("#username").text("玩转手机摄影");
        $("#username-mid").text(localStorage.UserName);
    },
    //标记全部已读
    updateAllIsRead: function () {
        var methodName = "/notice/AdminSetAllNoticeIsRead";
        var data = {};
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {

                $("#infoList").html("");
                $("#markAll").hide();
                $("#count").text(0);

            } else {
                Common.showErrorMsg(data.Message);
            }
        }, null, true);
    },
    //标记已读
    updateIsRead: function (NId) {
        var methodName = "/notice/AdminSetNoticeIsRead";
        var data = {
            NId: NId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {

                Layout.getInformationList();

            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //通知列表
    getInformationList: function () {
        var pageSize = 3;
        var methodName = "/notice/AdminNoticeList";
        var data = {
            IsRead: 0,
            Page: {
                PageSize: pageSize,
                PageIndex: 1
            }
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                //渲染html
                var render = template.compile(Layout.layoutTpl);
                var html = render(data.Data);
                $("#infoList").html(html);
                $("#count").text(data.Data.Total);
                if (data.Data.Total == 0) {
                    $("#markAll").hide();
                }
                else if (data.Data.Total > 0) {
                    $("#markAll").show();
                }
            } else {
                // Common.showErrorMsg(data.Message);
            }
        }, null, true);
    },
    //退出接口
    logout: function (isNoShowMsg) {
        $.ajax({
            url: "/account/loginout",
            type: "post",
            dataType: 'json',
            contentType: "application/json ; charset=utf-8",
        });

        localStorage.clear();

        if (isNoShowMsg) {
            window.location.href = "/account/login";
        }
        else {
            Common.showSuccessMsg("退出成功!", function () {
                window.location.href = "/account/login";
            });
        }
    },
    //获取管理员权限列表
    adminPermissionsList: function () {
        var methodName = "/admin/GetAdminPermissionsList";
        var data = {

        };
        SignRequest.setAsync(methodName, data, function (data) {
            if (data.Code == "100") {
                if (localStorage.getItem('IsStoreManager') == "true") {
                    //渲染html
                    var render = template.compile(Layout.storeSideBarTpl);
                } else {
                    //渲染html
                    var render = template.compile(Layout.sidebarTpl);
                }
                console.log(data)

                var html = render(data.Data);
                $(".sidebar-menu").html(html);

            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    }
}
