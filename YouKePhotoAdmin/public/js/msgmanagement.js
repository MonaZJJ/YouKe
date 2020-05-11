$(function () {
    Msgmanagement.init();
})

var Msgmanagement = {
    init: function () {
        //全选
        $("#selAll").on("change", function () {
            if ($(this).is(':checked')) {
                $(".checkbox").prop("checked", true);
            } else {
                $(".checkbox").prop("checked", false);
            }
        });


        //单个删除
        $("#productTable").on("click", ".status_delete", function () {
            var PId = [$(this).attr("data-id")];
            Common.confirmDialog("确认进行删除吗？", function () {
                Msgmanagement.deleteProduct(PId);
            });
        });

        //多个删除
        $("#delete").on("click", function () {
            Common.confirmDialog("确认对选中的数据进行删除吗？", function () {
                Msgmanagement.deleteProduct(Msgmanagement.getSelectedData());
            });
        });

        //表格分页每页显示数据
        $("#pagesize_dropdown").on("change", function () {
            Msgmanagement.projectQuery();
        });


        $("#send_if_confirm").click(function () {
            //消息标题验证
            if (!Validate.emptyValidateAndFocus("#MessageTitle", "请输入消息标题", "")) {
                return false;
            }
            //描述验证
            if (!Validate.emptyValidateAndFocus("#MessageContent", "请输入内容", "")) {
                return false;
            }
            Msgmanagement.AdminAddMessage();
        })


        // 获取详情
        $("body").on("click", ".fordetail", function () {
            Msgmanagement.GetAdminMessageDetail($(this).attr("data-id"));
        });



        Msgmanagement.initBootstrapTable();
    },
    // 获取选中的数据
    getSelectedData: function () {
        var list = $("#productTable .checkbox");
        var PId = [];
        for (var i = 0; i < list.length; i++) {
            if (list.eq(i).is(':checked')) {
                PId.push(list.eq(i).attr("data-pid"));
            }
        }
        return PId;
    },
    // 后台发布消息
    AdminAddMessage: function () {
        var methodName = "/AdminMessage/AdminAddMessage";
        var data = {
            "MessageTitle": $("#MessageTitle").val(),
            "MessageContent": $("#MessageContent").val()
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("发布成功", function () {
                    Msgmanagement.projectQuery();
                    $("#ifSureSendModal").modal("hide");
                    $("#MessageTitle").val("");
                    $("#MessageContent").val("");
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 获取后台消息详情
    GetAdminMessageDetail: function (MessageId) {
        var methodName = "/AdminMessage/GetAdminMessageDetail";
        var data = {
            MessageId: MessageId,
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                $("#editMessageTitle").text(data.Data.MessageTitle);
                $("#editMessageContent").text(data.Data.MessageContent);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },

    // 删除
    deleteProduct: function (PId) {
        if (PId.length < 1) {
            Common.showErrorMsg("请选择需要删除的消息");
            return false;
        }
        var methodName = "/AdminMessage/AdminDeleteMessage";
        var data = {
            MessageId: PId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("删除成功", function () {
                    Msgmanagement.projectQuery();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //bootstrapTable
    initBootstrapTable: function () {
        $('#productTable').bootstrapTable({
            method: 'post',
            url: SignRequest.urlPrefix + '/AdminMessage/GetAdminMessageList',
            dataType: "json",
            striped: true, //使表格带有条纹
            pagination: true, //在表格底部显示分页工具栏
            pageSize: $("#pagesize_dropdown").val(),
            pageNumber: 1,
            pageList: [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000],
            idField: "Id", //标识哪个字段为id主键
            showToggle: false, //名片格式
            cardView: false, //设置为True时显示名片（card）布局
            // showColumns: true, //显示隐藏列
            // showRefresh: true, //显示刷新按钮
            singleSelect: false, //复选框只能选择一条记录
            search: false, //是否显示右上角的搜索框
            clickToSelect: true, //点击行即可选中单选/复选框
            sidePagination: "server", //表格分页的位置
            queryParams: Msgmanagement.queryParams, //参数
            queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求
            toolbar: "#toolbar", //设置工具栏的Id或者class
            responseHandler: Msgmanagement.responseHandler,
            columns: [{
                    field: 'MessageId',
                    title: '',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = '<input type="checkbox" class="checkbox" data-pid="' + value + '">'
                        return html;
                    }
                },
                {
                    field: 'MessageTitle',
                    title: '标题',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'CreateTimeStr',
                    title: '时间',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'MessageId',
                    title: '操作',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = "";
                        html += "<a data-toggle='modal' class='fordetail' data-target='#editifSureSendModal' href='#" + value + "' style='margin-right: 15pxcursor: pointer;color: #039cf8;' data-id='" + value + "'>详情</a>";
                        html += "<span class='status_delete' data-id='" + value + "' style='margin-left: 10px;'>删除</span>";
                        return html;
                    }
                }
            ], //列
            silent: true, //刷新事件必须设置
            formatLoadingMessage: function () {
                return "请稍等，正在加载中...";
            },
            formatNoMatches: function () { //没有匹配的结果
                return '无符合条件的记录';
            },
            onLoadSuccess: function (data) {
                console.log(data);

                $('.caret').remove()

            },
            onLoadError: function (data) {
                $('#productTable').bootstrapTable('removeAll');
            },
            // 1.点击每行进行函数的触发
            onClickRow: function (row, tr, flied) {
                // 书写自己的方法

            },
            //2. 点击前面的复选框进行对应的操作
            //点击全选框时触发的操作
            //点击全选框时触发的操作
            onCheckAll: function (rows) {

                // for (var i = 0; i < rows.length; i++) {
                //     dishes_list.UserIdsList.push(rows[i].User.Id);
                //     dishes_list.UserOpenIds.push(rows[i].User.OpenId);
                // }

            },
            onUncheckAll: function (rows) {

            },
            //点击每一个单选框时触发的操作
            onCheck: function (row) {


            },
            //取消每一个单选框时对应的操作；
            onUncheck: function (row) {
                Array.prototype.remove = function (val) {
                    var index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };

            }
        });
    },
    //bootstrap table post 参数 queryParams
    queryParams: function (params) {
        //配置参数
        //方法名
        var methodName = "/AdminMessage/GetAdminMessageList";

        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            minSize: $("#leftLabel").val(),
            maxSize: $("#rightLabel").val(),
            minPrice: $("#priceleftLabel").val(),
            maxPrice: $("#pricerightLabel").val(),
            State: $("#State").find(".active").find("a").attr("data-type"),
            Name: $("#Name").val(),
            PSn: $("#PSn").val(),
            CateId: $("#CateId").val(),
            BrandId: $("#BrandId").val(),
            PlId: $("#Label").val(),
            TemplateId: $("#TemplateId").val(),
            Type: $("#Type").val(),
            Page: {
                PageSize: params.limit, //页面大小,
                PageIndex: (params.offset / params.limit) + 1, //页码
            }
        };
        return temp;
    },
    // 用于server 分页，表格数据量太大的话 不想一次查询所有数据，可以使用server分页查询，数据量小的话可以直接把sidePagination: "server"  改为 sidePagination: "client" ，同时去掉responseHandler: responseHandler就可以了，
    responseHandler: function (res) {
        if (res.Data != null) {
            console.log(res);
            return {
                "rows": res.Data.AdminMessageList,
                "total": res.Data.Total
            };
        } else {
            return {
                "rows": [],
                "total": 0
            };
        }
    },
    //表格刷新(直接刷新)
    refreshQuery: function (parame) {
        //方法名
        var methodName = "/AdminMessage/GetAdminMessageList";

        if (parame == "" || parame == undefined) {
            var obj = {
                State: $("#State").find(".active").find("a").attr("data-type"),
                Name: $("#Name").val(),
                PSn: $("#PSn").val(),
                CateId: $("#CateId").val(),
                BrandId: $("#BrandId").val(),
                PlId: $("#Label").val(),
                TemplateId: $("#TemplateId").val(),
                Type: $("#Type").val(),
            };
        } else {
            obj = parame;
        }

        $('#productTable').bootstrapTable(
            "refresh", {
                url: SignRequest.urlPrefix + methodName,
                query: obj
            }
        );
    },
    //表格刷新(先销毁后初始化)
    projectQuery: function (parame) {
        //方法名
        var methodName = "/AdminMessage/GetAdminMessageList";

        if (parame == "" || parame == undefined) {
            var obj = {
                State: $("#State").find(".active").find("a").attr("data-type"),
                Name: $("#Name").val(),
                PSn: $("#PSn").val(),
                CateId: $("#CateId").val(),
                BrandId: $("#BrandId").val(),
                PlId: $("#Label").val(),
                TemplateId: $("#TemplateId").val(),
                Type: $("#Type").val(),
                Page: {
                    PageSize: $("#pagesize_dropdown").val(), //页面大小,
                    PageIndex: Number($(".pagination").find(".active").text()), //页码
                }
            };
        } else {
            obj = parame;
        }

        $('#productTable').bootstrapTable(
            "destroy", {
                url: SignRequest.urlPrefix + methodName,
                query: obj
            }
        );

        Msgmanagement.initBootstrapTable();

    }
}