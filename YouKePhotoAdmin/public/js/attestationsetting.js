$(function () {
    Attestationsetting.init();
})

var Attestationsetting = {
    init: function () {
        Attestationsetting.AdminAuthenSetupData();
        UE.getEditor('RuleContent');
        $("#lastStep").click(function () {
            Attestationsetting.AdminAuthenSetupData();
        });


        $("#CreateMatch").click(function () {
            //完成作品数验证
            if (!Validate.emptyValidateAndFocus("#AuthenWorkCount", "请输入完成作品数", "")) {
                return false;
            }
            //完成推荐数验证
            if (!Validate.emptyValidateAndFocus("#AuthenRecommendCount", "请输入完成推荐数", "")) {
                return false;
            }
            //完成晋级数验证
            if (!Validate.emptyValidateAndFocus("#AuthenPromotionCount", "请输入完成晋级数", "")) {
                return false;
            }
            
            Attestationsetting.AdminAuthenSetup();
        });
    },
    // 获取认证设置数据
    AdminAuthenSetupData: function () {
        var methodName = "/AdminSetting/AdminAuthenSetupData";
        var data = {};
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                $("#AuthenWorkCount").val(data.Data.AuthenWorkCount);
                $("#AuthenRecommendCount").val(data.Data.AuthenRecommendCount);
                $("#AuthenPromotionCount").val(data.Data.AuthenPromotionCount);
                var ue = UE.getEditor('RuleContent');
                ue.ready(function () {
                    ue.setContent(data.Data.AuthenNotice);
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 认证设置
    AdminAuthenSetup: function () {
        var ue = UE.getEditor('RuleContent');
        if (ue.getContent() == "") {
            Common.showInfoMsg("请输入认证须知");
            return false;
        }
        var methodName = "/AdminSetting/AdminAuthenSetup";
        var data = {
            AuthenWorkCount: $("#AuthenWorkCount").val(),
            AuthenRecommendCount: $("#AuthenRecommendCount").val(),
            AuthenPromotionCount: $("#AuthenPromotionCount").val(),
            AuthenNotice: ue.getContent()
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