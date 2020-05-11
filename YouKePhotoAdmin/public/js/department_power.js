$(function () {
    //权限列表查询
    DepartmentPower.init();
});
var DepartmentPower = {
    init: function () {
        //文件收缩第一层级
        $('#table_content_classify').on('click', '.layer_ul_1 .layer-1 .jia_collapse_one', function () {
            var display_state = $(this).parents('.contentBody').siblings('.layer_ul_2').css('display');//所以要用行内样式控制

            if (display_state == 'none') {
                $(this).parents('.contentBody').siblings('.layer_ul_2').slideDown();
                $(this).find('img').attr('src', '../public/images/zhankai.png');
            }
            else {
                $(this).parents('.contentBody').siblings('.layer_ul_2').slideUp();
                $(this).find('img').attr('src', '../public/images/suoqi.png');
            }
        });

        //点击第一个全选
        $('#table_content_classify').on('click', '.layer_ul_1 .layer-1>.contentBody input', function () {
            var eachInput = $(this).parents('.layer-1').find('input');
            if (this.checked) {
                eachInput.each(function (ins, val) {
                    this.checked = true;

                });
            }
            else {
                eachInput.each(function (ins, val) {

                    if (this.checked) {
                    }
                    this.checked = false;
                });
            }
        });

        //点击个别的选项，取消全选
        $('#table_content_classify').on('click', '.layer_ul_2 .layer-2>.contentBody input', function () {
            //父级元素
            var eachInput = $(this).parents('.layer-1').find('.first').find('input');
            if (!this.checked) {
                //如果未选中的话，父级及兄弟级取消选中状态
                var noCheckFlag = true;

                $(this).parents('.layer_ul_2').find('input').each(function (index, item) {
                    //如果其中有一个未选中的话，就改变标志位
                    if (!this.checked) {
                        flag = false;
                    }
                    else {
                        noCheckFlag = false;
                    }
                });

                //如果全部都未选中的话
                if (noCheckFlag) {
                    //把父级选中
                    eachInput[0].checked = false;
                }
            }
            else {
                //如果是选中的话，要判断其父级下面的子级是否全部选中
                var flag = false;

                $(this).parents('.layer_ul_2').find('input').each(function (index, item) {
                    //如果其中有一个未选中的话，就改变标志位
                    if (this.checked) {
                        flag = true;
                    }
                });

                //如果全部都选中的话
                if (flag) {
                    //把父级选中
                    eachInput[0].checked = true;
                }
            }
        });

        //保存按钮点击的时候
        $('body').on('click', '#save', function () {
            Common.confirmDialog("确定修改该部门的权限吗？", function () {
                var checkActionIds = DepartmentPower.getCheckPermissions();
                DepartmentPower.changePowerSetting(checkActionIds);
            })
        });

        //全选按钮点击
        $('body').on('click', '#allSelect', function () {
            if (this.checked) {
                $('#table_content_classify').find('input').each(function (index, item) {
                    if (!this.checked) {
                        this.checked = true;
                    }
                })
            } else {
                $('#table_content_classify').find('input').each(function (index, item) {
                    this.checked = false;
                })
            }
        });

        DepartmentPower.listPower();
    },
    //模板
    permissionList_tpl: `
                {{each PermissionsList as value i}}
                <li class="layer-1">
                    <div class="contentBody">
                        <div class="col-xs-3">{{PermissionsList[i].AdminAId}}</div>
                        <div class="col-xs-5">
                            <div class="classify_one">
                                <i class="icon-jia jia_collapse_one">
                                    <img src="../public/images/zhankai.png" alt="">
                                </i>
                                <i class="iconfont icon-wenjianjia"></i>{{PermissionsList[i].Title}}
                            </div>
                        </div>
                        <div class="col-xs-4 first">
                            {{if PermissionsList[i].Selected==false}}
                            <input type="checkbox" data-id="{{PermissionsList[i].AdminAId}}" data-action="{{PermissionsList[i].Action}}">
                            {{else if PermissionsList[i].Selected==true}}
                            <input type="checkbox" checked  data-id="{{PermissionsList[i].AdminAId}}" data-action="{{PermissionsList[i].Action}}">
                            {{/if}}
                        </div>
                    </div>
            
                    <ul class="layer_ul_2" style="">
                        {{each PermissionsList[i].ChildList as value q}}
                        <li class="layer-2">
                            <div class="contentBody">
                                <div class="col-xs-3">{{PermissionsList[i].ChildList[q].AdminAId}}</div>
                                <div class="col-xs-5">
                                    <div class="classify_two">
                                        <i class="iconfont icon-wenjianjia"></i>{{PermissionsList[i].ChildList[q].Title}}
                                    </div>
                                </div>
                                <div class="col-xs-4">
                                    {{if PermissionsList[i].ChildList[q].Selected==false}}
                                    <input type="checkbox" data-id="{{PermissionsList[i].ChildList[q].AdminAId}}" data-action="{{PermissionsList[i].ChildList[q].Action}}">
                                    {{else if PermissionsList[i].ChildList[q].Selected==true}}
                                    <input type="checkbox" checked data-id="{{PermissionsList[i].ChildList[q].AdminAId}}"  data-action="{{PermissionsList[i].ChildList[q].Action}}">
                                    {{/if}}
                                </div>
                            </div>
                        </li>
                        {{/each}}
                    </ul>
                </li>
                {{/each}}`,
    //获取选中的权限列表
    getCheckPermissions: function () {
        //选择的动作Id列表
        var checkActionIds = "";
        //获取一级的input
        $('.first').find('input').each(function (index, item) {
            if ($(item).parents('.layer-1').find('.layer_ul_2').find('input').length > 0) {
                //标识
                var flag = false;

                //有子级的情况
                $(item).parents('.layer-1').find('.layer_ul_2').find('input').each(function (index2, item2) {
                    //选中的话把id存进数组里面,以逗号分隔
                    if (this.checked) {
                        flag = true;
                        checkActionIds += $(item2).attr('data-id') + ",";
                    }
                })
                //避免在循环里面添加
                if(flag){
                    checkActionIds += $(item).attr('data-id') + ",";
                }
            } else {
                //没有子级的情况
                if (this.checked) {
                    checkActionIds += $(item).attr('data-id') + ",";
                }
            }
        });

        if (checkActionIds.length > 0) {
            //去除最后一个逗号
            checkActionIds = checkActionIds.substring(0, checkActionIds.length - 1);
        }

        return checkActionIds;
    },
    //查询权限列表
    listPower: function () {
        var methodName = "/Department/AdminPermissionsList";
        var departmentId = Common.getUrlParam('departmentId');

        var data = {
            "DepartmentId": departmentId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                var render = template.compile(DepartmentPower.permissionList_tpl);
                var html = render(data.Data);
                $('#departmentPermission').html(html);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //设置权限
    changePowerSetting: function (actionIds) {
        var methodName = "/Department/AdminSetPermissions";
        var departmentId = Common.getUrlParam('departmentId');
        var data = {
            "DepartmentId": departmentId,
            "ActionIds": actionIds
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("设置权限成功", function () {
                    window.location.href = window.location.href;
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    }
}