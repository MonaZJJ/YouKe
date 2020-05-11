var amendPassword={
    init:function () {
        //获取用户信息
        var userName=localStorage.getItem('UserName');
        $("#userName").val(userName);
        // 点击确认按钮
        $(".content").on("click",'#amendInfoBtn',function () {
            //用户名验证
            if (!Validate.emptyValidateAndFocus("#userName", "请输入用户名", "")) {
                return false;
            }
            //原密码验证
            if (!Validate.emptyValidateAndFocus("#loginPassword", "请输入原密码", "")) {
                return false;
            }
            //密码验证
            if (!Validate.emptyValidateAndFocus("#password", "请输入密码", "")) {
                return false;
            }
            //确认密码验证
            if (!Validate.emptyValidateAndFocus("#surePassword", "请输入确认密码", "")) {
                return false;
            }
            if (!Validate.passwordConfirm("#password", "#surePassword")) {
                Common.showErrorMsg('新密码输入不一致！');
                return false;
            }
            amendPassword.amendAdminPassword();
        })
    },

    // 修改密码
    amendAdminPassword:function () {
        var methodName = "/AdminAccount/AdminUserUpPasswd";

        var data = {
            // id:localStorage.getItem('UserId'),
            "EnterPassword": $("#loginPassword").val(),
            "NewPassword": $("#password").val(),
            "AffirmPassword": $("#surePassword").val()
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == 100) {
                Common.showSuccessMsg("修改成功", function () {
                    $.ajax({
                        url: "/account/loginout",
                        type: "post",
                        dataType: 'json',
                        contentType: "application/json ; charset=utf-8",
                    });
                    localStorage.clear();
                    window.location.href = "/account/login";
                })
            } else {
                Common.showErrorMsg(data.Message,function () {
                    // 重置输入框及按钮
                    amendPassword.resetInput();
                });
            }
        });
    },
    resetInput:function () {
        $("#loginPassword").val("");
        $("#password").val("");
        $("#surePassword").val("");
    }
}
$(function () {
    amendPassword.init();
})