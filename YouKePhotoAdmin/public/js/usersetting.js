var Usersetting = {
    init: function () {
        // 获取排名规则设置数据
        Usersetting.getRankingrulesSetupData();


        $("#lastStep").click(function () {
            // 获取排名规则设置数据
            Usersetting.getRankingrulesSetupData();
        });

        $("#CreateMatch").click(function () {
            if (!Validate.emptyValidateAndFocus("#Rankingrules", "请输入排名规则", "")) {
                return false;
            }
            // 设置排名规则设置数据-编辑
            Usersetting.setRankingrulesSetup();
        });


    },
    // 获取排名规则设置数据
    getRankingrulesSetupData() {
        var methodName = "/AdminSetting/AdminRankingrulesSetupData";
        var data = {};
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                $("#Rankingrules").val(data.Data.Rankingrules);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 设置排名规则设置数据-编辑
    setRankingrulesSetup() {
        var methodName = "/AdminSetting/AdminRankingrulesSetup";
        var data = {
            Rankingrules: $("#Rankingrules").val()
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg(data.Data);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
}

$(function () {
    Usersetting.init();
})