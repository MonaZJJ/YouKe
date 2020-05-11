var Addtutorial = {
    init: function () {
        uploadIconPic('#small_upload_pick', '#small_icon', '/AdminTutorial/UploadTutorialImg');
        if (Common.getUrlParam("id")) {
            Addtutorial.AdminTutorialInfo(Common.getUrlParam("id"));
        }

        $("#nextStep").click(function () {
            // //视频名称验证
            // if (!Validate.emptyValidateAndFocus("#Name", "请输入视频名称", "")) {
            //     return false;
            // }
            //视频标题验证
            if (!Validate.emptyValidateAndFocus("#Title", "请输入视频标题", "")) {
                return false;
            }
            //视频链接验证
            if (!Validate.emptyValidateAndFocus("#Url", "请输入视频链接", "")) {
                return false;
            }
            if (!Validate.checkUrl("#Url")) {
                return false;

            }
            // 封面图
            if (!$('#small_icon').attr('data-src')) {
                Common.showInfoMsg('请上传封面图')
                return false;
            }

            //描述验证
            if (!Validate.emptyValidateAndFocus("#Desc", "请输入描述", "")) {
                return false;
            }

            //描述教程时长
            if (!Validate.emptyValidateAndFocus("#TutorialTime", "请输入教程时长", "")) {
                return false;
            }


            if (!Common.getUrlParam("id")) {
                Addtutorial.AdminAddTutorial()
            } else {
                Addtutorial.AdminEditTutorial()

            }
        })

    },
    // 后台添加教程
    AdminAddTutorial: function (PId) {
        var methodName = "/AdminTutorial/AdminAddTutorial";
        var data = {
            "Name": "",
            "Title": $("#Title").val(),
            "Desc": $("#Desc").val(),
            "Cover": $('#small_icon').attr('data-src'),
            "Url": $("#Url").val(),
            TutorialTime: $("#TutorialTime").val()
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("添加成功", function () {
                    window.location.href = "/tutorial/tutorialList"
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 后台编辑教程
    AdminEditTutorial: function (PId) {
        var methodName = "/AdminTutorial/AdminEditTutorial";
        var data = {
            "Name": "",
            "Title": $("#Title").val(),
            "Desc": $("#Desc").val(),
            "Cover": $('#small_icon').attr('data-src'),
            "Url": $("#Url").val(),
            TutorialId: Common.getUrlParam("id"),
            TutorialTime: $("#TutorialTime").val()
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("编辑成功", function () {
                    window.location.href = "/tutorial/tutorialList"
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },


    // 获取教程信息数据
    AdminTutorialInfo: function (Id) {
        var methodName = "/AdminTutorial/AdminTutorialInfo";
        var data = {
            TutorialId: Id
        };
        SignRequest.set(methodName, data, function (data) {
            console.log(data.Data)
            if (data.Code == "100") {
                $("#State").find(".active").find("a").text("编辑教程")
                // $("#Name").val(data.Data.Name);
                $("#Title").val(data.Data.Title);
                $("#Desc").val(data.Data.Desc);
                $("#TutorialTime").val(data.Data.TutorialTime);
                $('#small_icon').attr('data-src', data.Data.Cover).attr("src", data.Data.CoverFull);
                $("#Url").val(data.Data.Url);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
}
$(function () {
    Addtutorial.init();
})