$(function () {
    MangeEdit.init();
});
var MangeEdit={
    init:function () {
        //所属部门
        MangeEdit.getDepartmentNum();
        //保存基本信息
        $('#saveBasic').click(function () {
            var admingid=$('#deparments').find("option:selected").val()
            //alert(admingid)
            if(admingid!='' && admingid!=undefined){
                MangeEdit.saveBasicInfo(admingid);
            }
            else{
                swal("请选择所属部门", "", "error");
            }
        });
        //点击保存修改密码
        $('#savePassword').click(function () {
            var newPassword=$('#newPassword').val();
            var surePassword=$('#surePassword').val();
            if(newPassword!=''){
                if(newPassword==surePassword){
                    MangeEdit.changePassWord(newPassword);
                }
                else{
                    swal("俩次密码输入不一致", "", "error");
                }
            }
            else{
                swal("请输入完整信息", "", "error");
            }

        });



    },
    //获取总的部门数
    getDepartmentNum:function () {
        var methodName = "/Department/AdminAllDepartmentList";
        var data = {
            "page": {
                "PageSize": 1,
                "PageIndex": 1
            }
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                var render = template.compile(MangeEdit.cateTpl);
                var html = render(data.Data);
                $("#deparments").append(html);

                //基本信息
                MangeEdit.getBasicInfo();
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //部门下拉类表
    cateTpl:`
        {{each DepartmentList as value i}}
            <option value="{{DepartmentList[i].AdminGId}}">{{DepartmentList[i].Title}}</option>
        {{/each}}
    `,
    //获取基本信息
    getBasicInfo:function () {
        if(Common.getUrlParam('id')){
            var methodName = "/admin/AdminAdminInfo";
            var uid=Common.getUrlParam('id');
            var data = {
                "UId": uid
            };
            SignRequest.set(methodName, data, function (data) {
                if (data.Code == "100") {
                    $('.yonghuming').text(data.Data.AdminInfo.UserName);
                    var time=data.Data.AdminInfo.RegisterTime;
                    time=time.replace('T',' ');
                    $('.register_time').text(time);
                    $('#deparments option').each(function (ins,val) {
                        var txt=$(this).text();;
                        if(txt==data.Data.AdminInfo.Title){//'电商运营'
                            this.selected=true;
                        }
                    });
                } else {
                    Common.showErrorMsg(data.Message);
                }
            });
        }else {
            Common.showErrorMsg('请选择管理员！');
        }
    },
    //基本信息的保存
    saveBasicInfo:function (departMeid) {
        var methodName = "/admin/AdminEditAdminInfo";
        var uid=Common.getUrlParam('id');
        var data = {
            "AdmingId": departMeid,
            "UId": uid
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("基本信息保存成功",function () {
                    location.href = "/platform/adminoperation";
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //修改密码的保存
    changePassWord:function (password) {
        var methodName = "/admin/AdminEditAdminPwd";
        var uid=Common.getUrlParam('id');
        var data = {
            "UId": uid,
            "PassWord": password
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("密码修改成功",function () {
                    location.href = "/platform/adminoperation";
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    }

}