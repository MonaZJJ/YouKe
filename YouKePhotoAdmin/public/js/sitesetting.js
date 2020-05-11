$(function () {
    Sitesetting.init();
})

var Sitesetting = {
    init: function () {
        Sitesetting.AdminBasicSetupData();

        $("#lastStep").click(function () {
            Sitesetting.AdminBasicSetupData();
        });


        $("#CreateMatch").click(function () {
            //完成作品数验证
            if (!Validate.emptyValidateAndFocus("#Phone", "请输入客服电话", "")) {
                return false;
            }
            //完成推荐数验证
            if (!Validate.emptyValidateAndFocus("#Email", "请输入客服邮箱", "")) {
                return false;
            }
            //完成晋级数验证
            if (!Validate.emptyValidateAndFocus("#UserAgreement", "用户协议", "")) {
                return false;
            }
            Sitesetting.AdminBasicSetup();
        });
    },
    // 获取认证设置数据
    AdminBasicSetupData: function () {
        var methodName = "/AdminSetting/AdminBasicSetupData";
        var data = {};
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                $("#Phone").val(data.Data.Phone);
                $("#Email").val(data.Data.Email);
                $("#UserAgreement").val(data.Data.UserAgreement);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 认证设置
    AdminBasicSetup: function () {
        var methodName = "/AdminSetting/AdminBasicSetup";
        var data = {
            Phone: $("#Phone").val(),
            Email: $("#Email").val(),
            UserAgreement: $("#UserAgreement").val()
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg(data.Data);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    }
}