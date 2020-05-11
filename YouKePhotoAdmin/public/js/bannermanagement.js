var Bannermanagement = {
    ActivityTpl: `
        {{each GetAdminActivityNameList as value i}}
            <option value="{{value.ActivityId}}">{{value.Title}}</option>
        {{/each}}
    `,
    init: function () {
        uploadIconPic('#small_upload_pick', '#small_icon', '/AdminActivity/UploadActivityImg');
        Bannermanagement.AdminBannerSetupData();



        $("body").on("change", "#State", function () {
            var $selectedvalue = $("input[name='optionsRadiosinline']:checked").val();
            if ($selectedvalue == 1) {
                $(".activity").show();
                $(".program").hide();
            } else {
                $(".activity").hide();
                $(".program").show();
            }
        });


        $("#CreateMatch").click(function () {
            if ($("input[name='optionsRadiosinline']:checked").val() == "1") {
                if ($("#ActivityList").val()=="0") {
                    Common.showInfoMsg('请选择赛事');
                    return false;
                }
            } else if ($("input[name='optionsRadiosinline']:checked").val() == "2") {
                // 封面图
                if (!$('#small_icon').attr('data-src')) {
                    Common.showInfoMsg('请上传Banner图');
                    return false;
                }
                if (!Validate.emptyValidateAndFocus("#AppID", "请输入AppID", "")) {
                    return false;
                }
                if (!Validate.emptyValidateAndFocus("#AppPath", "请输入Path", "")) {
                    return false;
                }
                if (!Validate.emptyValidateAndFocus("#ExtraData", "请输入Data", "")) {
                    return false;
                }
            }

            Bannermanagement.AdminBannerSetup();
        })

    },
    // 获取赛事列表接口
    GetAdminActivityNameList: function (AId) {
        var methodName = "/AdminActivity/GetAdminActivityNameList";
        var data = {};
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                var render = template.compile(Bannermanagement.ActivityTpl);
                var html = render(data.Data);
                $("#ActivityList").append(html);
                $("#ActivityList").val(AId);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },

    // Banner设置数据
    AdminBannerSetup: function () {
        var methodName = "/AdminSetting/AdminBannerSetup";
        var data;

        if ($("input[name='optionsRadiosinline']:checked").val() == "1") {
            data = {
                "Type": 1,
                "AId": $("#ActivityList").val(),
                "BannerUrl": "",
                "AppId": "",
                "AppPath": "",
                "ExtraData": ""
            };
        } else if ($("input[name='optionsRadiosinline']:checked").val() == "2") {
            data = {
                "Type": 2,
                "AId": 0,
                "BannerUrl": $('#small_icon').attr('data-src'),
                "AppId": $("#AppID").val(),
                "AppPath": $("#AppPath").val(),
                "ExtraData": $("#ExtraData").val()
            };
        }
        SignRequest.set(methodName, data, function (data) {
            console.log(data.Data)
            if (data.Code == "100") {
                Common.showSuccessMsg(data.Data);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // Banner设置数据
    AdminBannerSetupData: function () {
        var methodName = "/AdminSetting/AdminBannerSetupData";
        var data = {};
        SignRequest.set(methodName, data, function (data) {
            console.log(data.Data)
            if (data.Code == "100") {
                if (data.Data.Type == 0 || data.Data.Type == 1) {
                    $(":radio[name='optionsRadiosinline'][value='1']").attr("checked", "checked");
                    Bannermanagement.GetAdminActivityNameList(data.Data.AId);
                    $(".activity").show();
                    $(".program").hide();


                } else if (data.Data.Type == 2) {
                    $(":radio[name='optionsRadiosinline'][value='2']").attr("checked", "checked");
                    $(".activity").hide();
                    $(".program").show();

                    $('#small_icon').attr('data-src', data.Data.BannerUrl).attr("src", data.Data.BannerFullUrl);
                    $("#AppID").val(data.Data.AppId);
                    $("#AppPath").val(data.Data.AppPath);
                    $("#ExtraData").val(data.Data.ExtraData);
                }
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
}

$(function () {
    Bannermanagement.init();
});