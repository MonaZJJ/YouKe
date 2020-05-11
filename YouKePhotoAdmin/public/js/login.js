var Login = {
    //初始化
    init: function () {
        
        $('#login').click(function () {
            if (!Login.isVaild()) {
                return;
            }
            Login.login();
        });

        $("body").on("keydown", function (e) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13) {
                if (!Login.isVaild()) {
                    return;
                }
                Login.login();
            }
        });
    },
    login: function () {

        //请求方法
        var methodName = "/AdminAccount/AdminLogin";

        //请求数据
        var userName = $("#userName").val();
        var password = $("#password").val();
        var data = {
            UserName: userName,
            Password: password
        };

        // 禁用输入框及按钮
        Login.disableInput();

        //请求接口
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                SignRequest.setToken(data.Data.Token);
                //加密用户信息
                var userMd5 = $.md5(userName + password).toUpperCase();
                //登录成功保存用户cookie信息
                localStorage.UserName = data.Data.UserName;
                localStorage.IsStoreManager = data.Data.IsStoreManager;
                //登录成功保存用户cookie信息
                Login.saveAuth(userMd5);
                window.location.href = "/";
            } else {
                // 重置输入框及按钮
                Login.resetInput();
                Common.showErrorMsg(data.Message);
            }
        }, function () {
            // 重置输入框及按钮
            Login.resetInput();
            Common.showErrorMsg("网络错误,请稍后重试!");
        });
    },
    // 校验
    isVaild: function () {
        //用户名验证
        if (!Validate.emptyValidateAndFocus("#userName", "请输入用户名", "")) {
            return false;
        }

        //密码验证
        if (!Validate.emptyValidateAndFocus("#password", "请输入密码", "")) {
            return false;
        }

        return true;
    },
    // 禁用输入框及按钮
    disableInput: function () {
        $("#login").attr("disabled", "disabled");
        $("#userName").attr("disabled", "disabled");
        $("#password").attr("disabled", "disabled");
        $("#login").text("正在登录中...");
    },
    // 重置输入框及按钮
    resetInput: function () {
        $("#login").removeAttr("disabled");
        $("#userName").removeAttr("disabled");
        $("#password").removeAttr("disabled");
        $("#login").text("登录");
    },
    //保存用户信息
    saveAuth: function (value) {
        var data = {
            Account: value
        };
        var jsonData = JSON.stringify(data);
        $.ajax({
            url: "/account/saveAuth",
            type: "post",
            dataType: 'json',
            contentType: "application/json ; charset=utf-8",
            async:false,
            data: jsonData
        });
    }
}
$(function () {
    Login.init();
});