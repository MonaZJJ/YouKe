var AuditSetting = {
    init: function () {
        // 获取审核设置数据
        AuditSetting.getAuditedSetupData();


        $("#lastStep").click(function () {
            // 获取审核设置数据
            AuditSetting.getAuditedSetupData();
        });

        $("#CreateMatch").click(function () {
            // 设置审核设置数据-编辑
            AuditSetting.setNeedAuditedSetup();
        });


    },
    // 获取审核设置数据
    getAuditedSetupData() {
        var methodName = "/AdminSetting/AdminNeedAuditedSetupData";
        var data = {};
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                $(":radio[name='optionsRadiosinline'][value='"+data.Data.NeedAudited+"']").attr("checked","checked");
                $("#Rankingrules").val(data.Data.Rankingrules);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 设置审核设置数据-编辑
    setNeedAuditedSetup() {
        var methodName = "/AdminSetting/AdminNeedAuditedSetup";
        var data = {
            NeedAudited: $('input:radio:checked').val()
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
    AuditSetting.init();
})