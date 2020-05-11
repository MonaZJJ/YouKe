var Addactivity = {
    StartTim: "",
    orderMsgTpl: `
    {{each Fields v i}}
    <div class="form-group orderbox">
            <label class="col-md-2 control-label">
            </label>
            <div class="col-md-1" style="padding-right:0;" class="type_box">
                <label class="checkbox-inline">
                    {{if v.Required==0}}
                        <input class="checkbox_type" type="checkbox" name="type_box" value="">必填
                    {{else}}
                        <input class="checkbox_type" type="checkbox" name="type_box" value="" checked="checked">必填
                    {{/if}}
                </label>
            </div>
            <div class="col-md-2">
                <label>
                    <input type="text" class="form-control msg_title" name="" value="{{v.Name}}"
                        placeholder="自定义标题">
                </label>
            </div>
            <div class="col-md-3">
                <button class="btn delete-btn delOrderBox" style="margin-top:0;">删除</button>
            </div>
    </div>
    {{/each}}`,
    orderMsgDetailTpl: `
    {{each Fields v i}}
    <div class="form-group orderbox">
            <label class="col-md-2 control-label">
            </label>
            <div class="col-md-1" style="padding-right:0;" class="type_box">
                <label class="checkbox-inline">
                    {{if v.Required==0}}
                        <input class="checkbox_type" type="checkbox" disabled="disabled" name="type_box" value="">必填
                    {{else}}
                        <input class="checkbox_type" type="checkbox" disabled="disabled" name="type_box" value="" checked="checked">必填
                    {{/if}}
                </label>
            </div>
            <div class="col-md-2">
                <label>
                    <input type="text" disabled="disabled" class="form-control msg_title" name="" value="{{v.Name}}"
                        placeholder="自定义标题">
                </label>
            </div>
    </div>
    {{/each}}`,
    GroupListTpl: `
    {{each Groups as v i}}
    <div class="form-group groupbox">
        <div class="col-md-7">
            <label>
                <input type="text" class="form-control group_title"  value="{{v}}" placeholder="自定义分组">
            </label>
        </div>
        <div class="col-md-1">
            <button class="btn delete-btn delgroupBox" style="margin-top:0;">删除</button>
        </div>
    </div>
    {{/each}}`,
    GroupListDetailTpl: `
    {{each Groups as v i}}
    <div class="form-group groupbox">
        <div class="col-md-7">
            <label>
                <input type="text" class="form-control group_title" disabled="disabled"  value="{{v.GroupName}}" placeholder="自定义分组">
            </label>
        </div>
    </div>
    {{/each}}`,
    Fields: [],
    orderMsgList: [],
    Groups: [],
    GroupsList: [],
    init: function () {

        uploadIconPic('#small_upload_pick', '#small_icon', '/AdminActivity/UploadActivityImg');
        //上传海报
        uploadIconPic('#rank_upload_pick', '#rank_icon', '/AdminActivity/UploadActivityImg');
        // 时间格式化
        Addactivity.initLaydateWithTime();
        UE.getEditor('RuleContent');
        if (Common.getUrlParam("id")) {
            Addactivity.AdminTutorialInfo(Common.getUrlParam("id"));
        }

        $("#nextStep").click(function () {
            //比赛主题验证
            if (!Validate.emptyValidateAndFocus("#Title", "请输入比赛主题", "")) {
                return false;
            }
            //副主题验证
            if (!Validate.emptyValidateAndFocus("#SmallTitle", "请输入副主题", "")) {
                return false;
            }

            // 封面图
            if (!$('#small_icon').attr('data-src')) {
                Common.showInfoMsg('请上传封面图')
                return false;
            }

            // 海报
            if (!$('#rank_icon').attr('data-src')) {
                Common.showInfoMsg('请上传海报')
                return false;
            }


            if ($("input[name='state']:checked").val() == 1) {
                Addactivity.StartTime = moment().format('YYYY-MM-D HH:mm:ss');
            } else {
                //开始时间
                if ($('#start').val() == "") {
                    Common.showInfoMsg('请输入开始时间');
                    return false;
                }
                Addactivity.StartTime = $('#start').val()
            }

            //结束时间
            if ($('#end').val() == "") {
                Common.showInfoMsg('请输入结束时间')
                return false;
            }




            Addactivity.orderMsgList = []
            var title_flag = true;
            $(".orderbox").each(function (index, item) {
                if ($(item).find('.checkbox_type').is(':checked')) {
                    var Required = 1;
                } else {
                    var Required = 0;
                }
                if ($(item).find(".msg_title").val() == "") {
                    title_flag = false;
                    $(item).find(".msg_title").focus();
                    return false;
                }
                var obj = {
                    Name: $(item).find(".msg_title").val(),
                    Required
                }

                Addactivity.orderMsgList.push(obj);
            })
            if (!title_flag) {
                Common.showInfoMsg('标题不能为空');
                return false;
            }
            console.log(Addactivity.orderMsgList)
            $("#type_box").find(".checkbox-inline").each(function (index, item) {
                console.log($(item).find(".checkbox_name").text())
                if ($(item).find('.checkbox_type').is(':checked')) {
                    var Required = 1;
                    var obj = {
                        Name: $(item).find(".checkbox_name").text(),
                        Required
                    }
                    Addactivity.orderMsgList.push(obj);
                }
            })
            if (Addactivity.orderMsgList.length < 1) {
                Common.showInfoMsg('个人信息至少一项')
            }


            //顺序验证
            if (!Validate.emptyValidateAndFocus("#Sort", "请输入顺序", "")) {
                return false;
            }
            //投稿次数验证
            if (!Validate.emptyValidateAndFocus("#ContributeTotal", "请输入投稿次数", "")) {
                return false;
            }
            //每组投稿次数验证
            if (!Validate.emptyValidateAndFocus("#GroupContributeTotal", "请输入每组投稿次数", "")) {
                return false;
            }
            //温馨提示验证
            if (!Validate.emptyValidateAndFocus("#FriendlyRemind", "请输入温馨提示", "")) {
                return false;
            }

            Addactivity.GroupsList = []
            var Groups_flag = true;
            $(".groupbox").each(function (index, item) {
                if ($(item).find(".group_title").val() == "") {
                    Groups_flag = false;
                    $(item).find(".group_title").focus();
                    return false;
                }
                Addactivity.GroupsList.push($(item).find(".group_title").val());
            })
            if (!Groups_flag) {
                Common.showInfoMsg('分组名称不能为空');
                return false;
            }

            if (!Common.getUrlParam("id")) {
                Addactivity.AdminAddactivity()
            } else {
                Addactivity.AdminEditActivity()

            }
        });


        $("#addOrderMsg").click(function () {
            Addactivity.Fields = [];
            $(".orderbox").each(function (index, item) {
                if ($(item).find('.checkbox_type').is(':checked')) {
                    var Required = 1;
                } else {
                    var Required = 0;
                }
                var obj = {
                    Name: $(item).find(".msg_title").val(),
                    Required
                }
                Addactivity.Fields.push(obj);
            })
            var obj = {
                Name: "",
                Required: 0
            }
            Addactivity.Fields.push(obj);
            var render = template.compile(Addactivity.orderMsgTpl);
            var html = render(Addactivity);
            $('#OrderMsgList').html(html);
        });




        // 删除box
        $("#OrderMsgList").on("click", ".delOrderBox", function () {
            $(this).parents(".form-group").remove();
            Addactivity.Fields = [];

            $(".orderbox").each(function (index, item) {
                if ($(item).find('.checkbox_type').is(':checked')) {
                    var Required = 1;
                } else {
                    var Required = 0;
                }
                var obj = {
                    Name: $(item).find(".msg_title").val(),
                    Required
                }
                Addactivity.Fields.push(obj);
            })
            console.log(Addactivity.Fields);
        });


        // 添加分组
        $("#addGroup").click(function () {
            console.log(Addactivity.Groups.length);
            if (Addactivity.Groups.length == 0) {
                $('#GroupList').show()
            }
            Addactivity.Groups = [];
            $(".groupbox").each(function (index, item) {
                Addactivity.Groups.push($(item).find(".group_title").val());
            });
            Addactivity.Groups.push("");
            console.log(Addactivity.Groups)
            var render = template.compile(Addactivity.GroupListTpl);
            var html = render(Addactivity);
            $('#GroupList').html(html);
        });




        // 删除分组box
        $("#GroupList").on("click", ".delgroupBox", function () {
            $(this).parents(".groupbox").remove();
            Addactivity.Groups = [];
            $(".groupbox").each(function (index, item) {
                Addactivity.Groups.push($(item).find(".group_title").val());
            })
            if (Addactivity.Groups.length == 0) {
                $('#GroupList').hide()
            }
        });


        $("body").on("change", "#State", function () {
            var $selectedvalue = $("input[name='state']:checked").val();
            if ($selectedvalue == 1) {
                $("#start").fadeOut();
            } else {
                $("#start").fadeIn();
            }
        });



        $("#preview").click(function () {
            var ue = UE.getEditor('RuleContent');
            console.log(ue.getContent())
            $("#previewBox").html(ue.getContent())
        });

    },
    // 后台添加教程
    AdminAddactivity: function () {
        var ue = UE.getEditor('RuleContent');
        if (ue.getContent() == "") {
            Common.showInfoMsg("请输入活动描述");
            return false;
        }
        var methodName = "/AdminActivity/AdminAddActivity";
        var data = {
            Title: $("#Title").val(),
            Name: "",
            Detail: ue.getContent(),
            Cover: $('#small_icon').attr('data-src'),
            Poster: $('#rank_icon').attr('data-src'),
            Sort: $("#Sort").val(),
            StartTime: Addactivity.StartTime,
            EndTime: $("#end").val(),
            Fields: Addactivity.orderMsgList,
            Groups: Addactivity.GroupsList,
            SmallTitle: $("#SmallTitle").val(),
            ContributeTotal: Number($("#ContributeTotal").val()),
            GroupContributeTotal: Number($("#GroupContributeTotal").val()),
            FriendlyRemind: $("#FriendlyRemind").val()
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("添加成功", function () {
                    window.location.href = "/activity/activityList"
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 后台编辑教程
    AdminEditActivity: function () {
        var ue = UE.getEditor('RuleContent');
        if (ue.getContent() == "") {
            Common.showInfoMsg("请输入赛事描述");
            return false;
        }
        var methodName = "/AdminActivity/AdminEditActivity";
        var data = {
            ActivityId: Common.getUrlParam("id"),
            Title: $("#Title").val(),
            Name: "",
            Detail: ue.getContent(),
            Cover: $('#small_icon').attr('data-src'),
            Poster: $('#rank_icon').attr('data-src'),
            Sort: $("#Sort").val(),
            StartTime: Addactivity.StartTime,
            EndTime: $("#end").val(),
            Groups: Addactivity.GroupsList,
            SmallTitle: $("#SmallTitle").val(),
            ContributeTotal: Number($("#ContributeTotal").val()),
            GroupContributeTotal: Number($("#GroupContributeTotal").val()),
            FriendlyRemind: $("#FriendlyRemind").val()
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("编辑成功", function () {
                    window.location.href = "/activity/activityList";
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },


    // 获取教程信息数据
    AdminTutorialInfo: function (Id) {
        var methodName = "/AdminActivity/GetAdminActivityInfo";
        var data = {
            ActivityId: Id
        };
        SignRequest.set(methodName, data, function (data) {
            console.log(data.Data)
            if (data.Code == "100") {

                $("#State").find(".active").find("a").text("编辑赛事")
                $("input[type=radio][name=state][value=2]").attr("checked",'checked');

                $("#start").val(data.Data.StartTimeStr).show();
                $("#end").val(data.Data.EndTimeStr);
                $("#Sort").val(data.Data.Sort);
                $("#SmallTitle").val(data.Data.SmallTitle);
                $("#ContributeTotal").val(data.Data.ContributeTotal);
                $("#GroupContributeTotal").val(data.Data.GroupContributeTotal);
                $("#FriendlyRemind").val(data.Data.FriendlyRemind);

                $("#Title").val(data.Data.Title);
                $('#small_icon').attr('data-src', data.Data.Cover).attr("src", data.Data.CoverStr);
                $('#rank_icon').attr('data-src', data.Data.Poster).attr("src", data.Data.PosterStr);
                var ue = UE.getEditor('RuleContent');
                ue.ready(function () {
                    ue.setContent(data.Data.Detail);
                });
                $("#addOrderMsg").remove();
                $("#addGroup").remove();
                $("#type_box").remove();

                Addactivity.Fields = data.Data.List
                var render = template.compile(Addactivity.orderMsgDetailTpl);
                var html = render(Addactivity);
                $('#OrderMsgList').html(html);
                $('#OrderMsgList').css({
                    "position": "relative",
                    "top": "-41px"
                })

                Addactivity.Groups = data.Data.Groups;
                if (Addactivity.Groups.length < 1) {
                    $(".groupList").hide();
                } else {
                    var render = template.compile(Addactivity.GroupListDetailTpl);
                    var html = render(Addactivity);
                    $('#GroupList').html(html).show();
                }


            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //初始化日期控件：日期时间
    initLaydateWithTime: function () {
        //日期范围限制
        var start = laydate.render({
            elem: '#start',
            type: 'datetime',
            istoday: false,
            done: function (value, date) {
                if (value != "") {
                    date.month = date.month - 1;
                    end.config.min = date; //开始日选好后，重置结束日的最小日期
                }
            }
        })

        var end = laydate.render({
            elem: '#end',
            type: 'datetime',
            istoday: false,
            done: function (value, date) {
                if (value != "") {
                    date.month = date.month - 1;
                    start.config.max = date; //结束日选好后，重置开始日的最大日期
                }
            }
        })
    },
}
$(function () {
    Addactivity.init();
})