var ModelList = {
    modelListTpl: `
        {{each AdminPhoneModelList as value i}}
            <div class="tag_box">
                {{value.Name}}
                <span class="close_tag" data-id="{{value.ModelId}}">x</span>
            </div>
        {{/each}}
    `,
    init: function () {
        ModelList.GetAdminPhoneModelList();
        // 删除标签
        $(".tag_list").on("click", '.close_tag', function () {
            ModelList.DeletePhoneModel($(this));
        })

        $("#creatTabNameBtn").click(function () {
            //机型名称验证
            if (!Validate.emptyValidateAndFocus("#Name", "请输入机型名称", "")) {
                return false;
            }
            ModelList.AddPhoneModel();
        });
    },
    // 后台机型列表
    GetAdminPhoneModelList: function () {
        var methodName = "/AdminPhoneModel/GetAdminPhoneModelList";
        var data = {};
        SignRequest.set(methodName, data, function (data) {
            console.log(data.Data)
            if (data.Code == "100") {
                var render = template.compile(ModelList.modelListTpl);
                var html = render(data.Data);
                $(".tag_list").html(html);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 新增机型
    AddPhoneModel: function () {
        var methodName = "/AdminPhoneModel/AddPhoneModel";
        var data = {
            Name: $("#Name").val()
        };
        SignRequest.set(methodName, data, function (data) {
            console.log(data.Data)
            if (data.Code == "100") {
                Common.showSuccessMsg("添加成功", function () {
                    $("#addGrouping").modal("hide");
                    ModelList.GetAdminPhoneModelList();
                    $("#Name").val("");
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 删除机型
    DeletePhoneModel: function (_this) {
        var methodName = "/AdminPhoneModel/AdminDeletePhoneModel";
        var data = {
            ModelId: _this.attr("data-id")
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("删除成功", function () {
                    $("#addGrouping").modal("hide");
                    _this.parents(".tag_box").remove();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
}
$(function () {
    ModelList.init()
})