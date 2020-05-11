$(function () {
    ActivityDetail.init();
})

var ActivityDetail = {
    UserIdsList: [],
    level: "",
    wid: "",
    ImgList: [],
    ImgTitle: "",
    ImgIndex: 0,
    TypeTpl: `
        {{each List as value i}}
            <option value="{{value.RecordId}}">{{value.GroupName}}</option>
        {{/each}}
    `,
    initflag: true,
    onLoadSuccessData: [],
    trIndex: 0,
    init: function () {
        ActivityDetail.initLaydateWithTime();
        //上一页
        $("body").on("click", ".previous_page", function () {
            var ImgList = ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].ImgList;
            if (ActivityDetail.ImgIndex - 1 < 1) {
                if (ActivityDetail.trIndex == 0) {
                    Common.showErrorMsg("已是此页第一条");
                    return false;
                }
                ActivityDetail.trIndex--;
                ImgList = ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].ImgList;
                ActivityDetail.ImgIndex = ImgList.length;
            } else {
                ActivityDetail.ImgIndex = ActivityDetail.ImgIndex - 1;
            }

            $(".preview_img").attr("src", ImgList[ActivityDetail.ImgIndex - 1].SimpleImgUrl);
            $(".preview_span").text(ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].WId + ".jpg");
            $("#DownloadImg").attr("data-href", ImgList[ActivityDetail.ImgIndex - 1].ImgUrl);
            if (ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].IsUp == false) {
                var text = "";
                if ($("#State").find(".active").find("a").attr("data-type") == 1) {
                    text = "入围"
                } else if ($("#State").find(".active").find("a").attr("data-type") == 2) {
                    text = "晋级"
                } else if ($("#State").find(".active").find("a").attr("data-type") == 3) {
                    text = "获奖"
                }
                $(".update-promotion").attr("data-id", ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].WId).attr("data-level", ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].Level).text(text).show();
            } else {
                $(".update-promotion").hide();
            }

            var data = ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].ImgList[ActivityDetail.ImgIndex - 1];
            var img_msg = `<p style="display:inline-block;width:100%;margin:0;">
                <span style='color: #3c8dbc;float:left;'>设备型号：${data.Device}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>镜头：${data.Camera}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>光圈：${data.Aperture}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>曝光补偿：${data.ExposureCompensation}</span></p>
                <p style="display:inline-block;width:100%;margin:0;">
                <span style='color: #3c8dbc;float:left;'>焦距：${data.Foci}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>ISO：${data.ISO}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>拍照时间：${data.ShootingTime}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>快门：${data.Shutter}</span>
            </p>`;
            $(".img_msg").html("");
            $(img_msg).appendTo(".img_msg");
        });
        //下一页
        $("body").on("click", ".next_page", function () {
            var ImgList = ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].ImgList;
            if (ActivityDetail.ImgIndex + 1 > ImgList.length) {
                if (ActivityDetail.trIndex == ActivityDetail.onLoadSuccessData.length - 1) {
                    Common.showErrorMsg("已是此页最后一条");
                    return false;
                }
                ActivityDetail.trIndex++;
                ImgList = ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].ImgList;
                ActivityDetail.ImgIndex = 0;
            } else {
                ActivityDetail.ImgIndex++;
            }
            if (ActivityDetail.ImgIndex == 0) {
                $(".preview_img").attr("src", ImgList[ActivityDetail.ImgIndex].SimpleImgUrl);
                $(".preview_span").text(ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].WId + ".jpg");
                $("#DownloadImg").attr("data-href", ImgList[ActivityDetail.ImgIndex].ImgUrl);
                ActivityDetail.ImgIndex++;
            } else {
                $(".preview_img").attr("src", ImgList[ActivityDetail.ImgIndex - 1].SimpleImgUrl);
                $(".preview_span").text(ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].WId + ".jpg");
                $("#DownloadImg").attr("data-href", ImgList[ActivityDetail.ImgIndex - 1].ImgUrl);
            }
            if (ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].IsUp == false) {
                var text = "";
                if ($("#State").find(".active").find("a").attr("data-type") == 1) {
                    text = "入围"
                } else if ($("#State").find(".active").find("a").attr("data-type") == 2) {
                    text = "晋级"
                } else if ($("#State").find(".active").find("a").attr("data-type") == 3) {
                    text = "获奖"
                }
                $(".update-promotion").attr("data-id", ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].WId).attr("data-level", ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].Level).text(text).show();
            } else {
                $(".update-promotion").hide();
            }

            var data = ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].ImgList[ActivityDetail.ImgIndex - 1];
            var img_msg = `<p style="display:inline-block;width:100%;margin:0;">
                <span style='color: #3c8dbc;float:left;'>设备型号：${data.Device}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>镜头：${data.Camera}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>光圈：${data.Aperture}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>曝光补偿：${data.ExposureCompensation}</span></p>
                <p style="display:inline-block;width:100%;margin:0;">
                <span style='color: #3c8dbc;float:left;'>焦距：${data.Foci}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>ISO：${data.ISO}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>拍照时间：${data.ShootingTime}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>快门：${data.Shutter}</span>
            </p>`;
            $(".img_msg").html("");
            $(img_msg).appendTo(".img_msg");
        });



        //全选
        $("#selAll").on("change", function () {
            if ($(this).is(':checked')) {
                $(".checkbox").each(function (index, item) {
                    if ($(item).prop("disabled") == false) {
                        $(item).prop("checked", true);
                    }
                })
            } else {
                $(".checkbox").prop("checked", false);
            }
        });

        //单个删除
        $("#productTable").on("click", ".status_delete", function () {
            var PId = [$(this).attr("data-id")];
            Common.confirmDialog("确认进行删除吗？", function () {
                ActivityDetail.deleteProduct(PId);
            });
        });
        //多个删除
        $("#delete").on("click", function () {
            Common.confirmDialog("确认对选中的数据进行删除吗？", function () {
                ActivityDetail.deleteProduct(ActivityDetail.getSelectedData());
            });
        });

        //表格分页每页显示数据
        $("#sorting").on("change", function () {
            ActivityDetail.GetAdminActivityStatus();
        });

        //表格分页每页显示数据
        $("#pagesize_dropdown").on("change", function () {
            ActivityDetail.projectQuery();
        });

        // 更改状态
        $("body").on("click", '#State a', function (e) {
            e.preventDefault()
            $(this).tab('show');
            console.log($(this).attr("data-type"));
            if ($(this).attr("data-type") == 1) {
                $("#Batchpromotion").text("批量入围");
            } else if ($(this).attr("data-type") == 2) {
                $("#Batchpromotion").text("批量晋级");
            }

            ActivityDetail.GetAdminActivityStatus();
        });
        $(".update-promotion").click(function () {
            var text = "";
            ActivityDetail.wid = $(this).attr("data-id");
            ActivityDetail.level = $(this).attr("data-level");

            if ($("#State").find(".active").find("a").attr("data-type") == "3") {
                $("#addGrouping").modal("show");
                return false;
            }
            if ($("#State").find(".active").find("a").attr("data-type") == 1) {
                text = "是否入围？"
            } else if ($("#State").find(".active").find("a").attr("data-type") == 2) {
                text = "是否晋级？"
            }
            Common.confirmDialog(text, function () {
                ActivityDetail.UpActivityWork();
            });
        })
        // 晋级
        $("body").on("click", ".editpromotion", function () {
            var text = "";
            ActivityDetail.wid = $(this).attr("data-id");
            ActivityDetail.level = $(this).attr("data-level");

            if ($("#State").find(".active").find("a").attr("data-type") == "3") {
                $("#addGrouping").modal("show");
                return false;
            }
            if ($("#State").find(".active").find("a").attr("data-type") == 1) {
                text = "是否入围？"
            } else if ($("#State").find(".active").find("a").attr("data-type") == 2) {
                text = "是否晋级？"
            }
            Common.confirmDialog(text, function () {
                ActivityDetail.UpActivityWork();
            });
        });
        // 晋级模态框
        $("#creatTabNameBtn").click(function () {
            if (!Validate.emptyValidateAndFocus("#Level_val", "请输入具体奖项", "")) {
                return false;
            }
            ActivityDetail.level = $("#Level_val").val();
            ActivityDetail.UpActivityWork();
        });

        // 撤回
        $("body").on("click", ".editwithdraw", function () {
            var wid = $(this).attr("data-id");
            var level = $(this).attr("data-level");
            Common.confirmDialog("是否撤回?", function () {
                ActivityDetail.CancelUpActivityWork(wid, level);
            });
        });

        // 批量晋级
        $("#Batchpromotion").click(function () {
            ActivityDetail.UserIdsList = new Array();
            $(".checkbox").each(function (index, item) {
                if ($(this).is(':checked')) {
                    ActivityDetail.UserIdsList.push(Number($(item).attr("data-pid")))
                }
            })
            if (ActivityDetail.UserIdsList.length < 1) {
                Common.showErrorMsg("请选择作品");
                return false;
            }
            ActivityDetail.BatchUpActivityWork();
        });

        // 进入下一阶段
        $("#Nextstage").click(function () {
            ActivityDetail.UpActivity();
        });

        // 查詢
        $("#search").on("click", function () {
            ActivityDetail.projectQuery();
        });

        //图片模态框
        $("#productTable").on("click", ".chairImg", function () {
            ActivityDetail.trIndex = $(this).parents("tr").attr("data-index");
            // 记录当前图片数据
            ActivityDetail.ImgIndex = $(this).parents("td").find("span").index($(this).parent()) + 1;
            ActivityDetail.ImgTitle = $(this).attr("data-title");
            ActivityDetail.ImgList = JSON.parse($(this).attr("data-ImgList"));
            $(".preview_img").attr("src", $(this).attr("src"));
            $(".preview_span").text(ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].WId + ".jpg");
            $("#DownloadImg").attr("data-href", $(this).attr("data-src"));

            if (ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].IsUp == false) {
                var text = "";
                if ($("#State").find(".active").find("a").attr("data-type") == 1) {
                    text = "入围"
                } else if ($("#State").find(".active").find("a").attr("data-type") == 2) {
                    text = "晋级"
                } else if ($("#State").find(".active").find("a").attr("data-type") == 3) {
                    text = "获奖"
                }
                $(".update-promotion").attr("data-id", ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].WId).attr("data-level", ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].Level).text(text).show();
            } else {
                $(".update-promotion").hide();
            }

            var data = ActivityDetail.onLoadSuccessData[ActivityDetail.trIndex].ImgList[ActivityDetail.ImgIndex-1];
            var img_msg = `<p style="display:inline-block;width:100%;margin:0;">
                <span style='color: #3c8dbc;float:left;'>设备型号：${data.Device}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>镜头：${data.Camera}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>光圈：${data.Aperture}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>曝光补偿：${data.ExposureCompensation}</span></p>
                <p style="display:inline-block;width:100%;margin:0;">
                <span style='color: #3c8dbc;float:left;'>焦距：${data.Foci}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>ISO：${data.ISO}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>拍照时间：${data.ShootingTime}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>快门：${data.Shutter}</span>
            </p>`;
            $(".img_msg").html("");
            $(img_msg).appendTo(".img_msg");
        });

        $("#DownloadImg").click(function () {
            ActivityDetail.DownloadImg();
        });
        // 获取比赛分组列表
        ActivityDetail.GetActivityGroupList();
        // 查询状态
        ActivityDetail.GetAdminActivityStatus();
    },
    // 删除
    deleteProduct: function (PId) {
        var methodName = "/AdminWorks/DeleteAdminWork";
        var data = {
            Ids: PId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("删除成功", function () {
                    ActivityDetail.projectQuery();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 获取比赛分组列表
    GetActivityGroupList: function () {
        var methodName = "/AdminActivity/AdminGetActivityGroupList";
        var data = {
            AId: Common.getUrlParam("id")
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                var render = template.compile(ActivityDetail.TypeTpl);
                var html = render(data.Data);
                $("#TypeList").append(html);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 获取选中的数据
    getSelectedData: function () {
        var list = $("#productTable .checkbox");
        var PId = [];
        for (var i = 0; i < list.length; i++) {
            if (list.eq(i).is(':checked')) {
                PId.push(list.eq(i).attr("data-pid"));
            }
        }
        return PId;
    },
    DownloadImg: function () {
        let src = $("#DownloadImg").attr("data-href");
        var canvas = document.createElement('canvas');
        var img = document.createElement('img');
        img.onload = function (e) {
            canvas.width = img.width;
            canvas.height = img.height;
            var context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, img.width, img.height);
            canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
            canvas.toBlob((blob) => {
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = $(".preview_span").text();
                link.click();
            }, "image/jpeg");
        }
        img.setAttribute("crossOrigin", 'Anonymous');
        img.src = src;
    },
    // 后台比赛作品晋级
    UpActivityWork: function () {
        var methodName = "/AdminActivity/UpActivityWork";
        var data = {
            "WId": ActivityDetail.wid,
            "Level": Number(ActivityDetail.level),
            PrizeName: $("#PrizeName").val(),
            Branch: $("#Branch").val()
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showTimerSuccessMsg(data.Data, function () {
                    ActivityDetail.GetAdminActivityStatus();
                    $("#addGrouping").modal("hide");
                    $("#Level_val").val("");
                    $("#PrizeName").val("");
                    $(".update-promotion").hide();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 后台比赛作品取消晋级
    CancelUpActivityWork: function (wid, level) {
        var methodName = "/AdminActivity/CancelUpActivityWork";
        var data = {
            "WId": wid,
            "Level": level
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showTimerSuccessMsg(data.Data, function () {
                    ActivityDetail.GetAdminActivityStatus();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 后台比赛作品批量晋级
    BatchUpActivityWork: function () {
        var methodName = "/AdminActivity/BatchUpActivityWork";
        var data = {
            WIds: ActivityDetail.UserIdsList,
            AId: Common.getUrlParam("id")
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg(data.Data, function () {
                    ActivityDetail.GetAdminActivityStatus();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 后台比赛进入下一阶段
    UpActivity: function () {
        var methodName = "/AdminActivity/UpActivity";
        var data = {
            AId: Common.getUrlParam("id")
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg(data.Data, function () {
                    ActivityDetail.GetAdminActivityStatus();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },

    //获取后台比赛状态
    GetAdminActivityStatus: function (flag = true) {
        var methodName = "/AdminActivity/GetAdminActivityStatus";
        var data = {
            ActivityId: Common.getUrlParam("id")
        };
        SignRequest.set(methodName, data, function (data) {
            console.log(data.Data)
            if (data.Code == "100") {
                if (flag) {
                    var obj = {
                        Type: $("#State").find(".active").find("a").attr("data-type"),
                        OrderModel: $("#sorting").val(),
                        AId: Common.getUrlParam("id"),
                        GId: $("#TypeList").val(),
                        Page: {
                            PageSize: $("#pagesize_dropdown").val(), //页面大小,
                            PageIndex: Number($(".pagination").find(".active").text()), //页码
                        }
                    };
                    ActivityDetail.refreshQuery(obj);
                    if (ActivityDetail.initflag) {
                        ActivityDetail.initBootstrapTable();
                        ActivityDetail.initflag = false;
                    }
                }
                if (data.Data == 1) {
                    $("#Batchpromotion").text("批量入围");
                } else if (data.Data == 2) {
                    $(".shortlisted").show();
                    $("#Batchpromotion").text("批量晋级");
                } else if (data.Data == 3) {
                    $(".shortlisted").show();
                    $(".promotion").show();
                } else if (data.Data == 4) {
                    $(".shortlisted").show();
                    $(".promotion").show();
                    $(".winning").show();
                }
                if (data.Data == $("#State").find(".active").find("a").attr("data-type")) {
                    $("#Batchpromotion").show();
                    $("#Nextstage").show();
                } else {
                    $("#Batchpromotion").hide();
                    $("#Nextstage").hide();
                }
                if (data.Data == 3) {
                    $("#Batchpromotion").hide();
                } else if (data.Data == 4) {
                    $("#Batchpromotion").hide();
                    $("#Nextstage").hide();
                }

                setTimeout(() => {
                    if (data.Data == $("#State").find(".active").find("a").attr("data-type")) {
                        $(".editwithdraw").show();
                        $(".editpromotion").show();
                    } else {
                        $("#productTable .checkbox").attr("disabled", "disabled");
                        $(".editwithdraw").hide();
                        $(".editpromotion").hide();
                    }
                    if (data.Data == 4) {
                        $("#Batchpromotion").hide();
                        $("#Nextstage").hide();
                        $("#productTable .checkbox").attr("disabled", "disabled");
                        $(".editwithdraw").hide();
                        $(".editpromotion").hide();
                    }
                }, 500);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //获取后台比赛状态
    GetAdminActivityStatus2: function () {
        var methodName = "/AdminActivity/GetAdminActivityStatus";
        var data = {
            ActivityId: Common.getUrlParam("id")
        };
        SignRequest.set(methodName, data, function (data) {
            console.log(data.Data)
            if (data.Code == "100") {
                if (data.Data == 1) {
                    $("#Batchpromotion").text("批量入围");
                } else if (data.Data == 2) {
                    $(".shortlisted").show();
                    $("#Batchpromotion").text("批量晋级");
                } else if (data.Data == 3) {
                    $(".shortlisted").show();
                    $(".promotion").show();
                } else if (data.Data == 4) {
                    $(".shortlisted").show();
                    $(".promotion").show();
                    $(".winning").show();
                }
                if (data.Data == $("#State").find(".active").find("a").attr("data-type")) {
                    $("#Batchpromotion").show();
                    $("#Nextstage").show();
                } else {
                    $("#Batchpromotion").hide();
                    $("#Nextstage").hide();
                }
                if (data.Data == 3) {
                    $("#Batchpromotion").hide();
                } else if (data.Data == 4) {
                    $("#Batchpromotion").hide();
                    $("#Nextstage").hide();
                }

                setTimeout(() => {
                    if (data.Data == $("#State").find(".active").find("a").attr("data-type")) {
                        $(".editwithdraw").show();
                        $(".editpromotion").show();
                    } else {
                        $("#productTable .checkbox").attr("disabled", "disabled");
                        $(".editwithdraw").hide();
                        $(".editpromotion").hide();
                    }
                    if (data.Data == 4) {
                        $("#Batchpromotion").hide();
                        $("#Nextstage").hide();
                        $("#productTable .checkbox").attr("disabled", "disabled");
                        $(".editwithdraw").hide();
                        $(".editpromotion").hide();
                    }
                }, 500);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //bootstrapTable
    initBootstrapTable: function () {
        $('#productTable').bootstrapTable({
            method: 'post',
            url: SignRequest.urlPrefix + '/AdminActivity/GetAdminActivityAllWorkList',
            dataType: "json",
            striped: true, //使表格带有条纹
            pagination: true, //在表格底部显示分页工具栏
            pageSize: $("#pagesize_dropdown").val(),
            pageNumber: 1,
            pageList: [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000],
            idField: "Id", //标识哪个字段为id主键
            showToggle: false, //名片格式
            cardView: false, //设置为True时显示名片（card）布局
            // showColumns: true, //显示隐藏列
            // showRefresh: true, //显示刷新按钮
            singleSelect: false, //复选框只能选择一条记录
            search: false, //是否显示右上角的搜索框
            clickToSelect: true, //点击行即可选中单选/复选框
            sidePagination: "server", //表格分页的位置
            queryParams: ActivityDetail.queryParams, //参数
            queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求
            toolbar: "#toolbar", //设置工具栏的Id或者class
            responseHandler: ActivityDetail.responseHandler,
            columns: [{
                    field: 'WId',
                    title: '',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        if (row.IsUp == false) {
                            var html = '<input type="checkbox" class="checkbox" data-pid="' + value + '">'
                        } else {
                            var html = '<input type="checkbox" class="checkbox" disabled="disabled" data-pid="' + value + '">'
                        }
                        return html;
                    }
                },
                {
                    field: 'WId',
                    title: '编号',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'NickName',
                    title: '昵称',
                    align: 'left',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var e = '<span style="padding-left:10px;margin-right:-10px;"><img src=' + row.Avatar + ' class="chairImg" alt="暂无图片" style ="width: 56px;height: 56px;border-radius:50%;margin-right:20px;">' + row.NickName + '</span>';
                        return e;
                    }
                },
                {
                    field: 'Title',
                    title: '标题',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'NickName',
                    title: '作品',
                    align: 'center',
                    valign: 'middle',
                    width: "352px",
                    formatter: function (value, row, index) {
                        var html = "";
                        for (var i = 0; i < row.ImgList.length; i++) {
                            html += "<span style='margin-right: 7px;'  data-toggle='modal' data-target='#ifSureSendModal'><img data-ImgList='" + JSON.stringify(row.ImgList) + "' src=" + row.ImgList[i].SimpleImgUrl + " data-src='" + row.ImgList[i].ImgUrl + "' class='chairImg' title='" + row.Title + - +(i + 1) + "' data-title='" + row.Title + "' alt='" + row.Title + - +(i + 1) + "' style ='width: 30px;height: 30px;'></span>";
                        }
                        return html;
                    }
                },
                {
                    field: 'GroupName',
                    title: '分组',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'LikeCount',
                    title: '点赞数',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'CreateTimeStr',
                    title: '上传时间',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'StatusStr',
                    title: '状态',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var e = '<span>' + value + '</span>';
                        return e;
                    }
                },

                {
                    field: 'WId',
                    title: '操作',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = "";
                        html += "<a href='/production/productionDetail?id=" + value + "' style='margin-right: 15px;color: #039cf8;' data-id='" + value + "'>详情</a>";
                        html += "<a href='/production/commentsList?id=" + value + "' style='margin-right: 15px;color: #039cf8;' data-id='" + value + "'>查看评论</a>";
                        if (row.IsUp == false) {
                            var text = "";
                            if ($("#State").find(".active").find("a").attr("data-type") == 1) {
                                text = "入围"
                            } else if ($("#State").find(".active").find("a").attr("data-type") == 2) {
                                text = "晋级"
                            } else if ($("#State").find(".active").find("a").attr("data-type") == 3) {
                                text = "获奖"
                            }

                            html += "<span class='editpromotion' data-id='" + value + "' data-level='" + row.Level + "' style='margin-right: 15px;cursor: pointer;color: #039cf8;display:none;'>" + text + "</span>";
                        } else {
                            html += "<span class='editwithdraw' data-id='" + value + "' data-level='" + row.Level + "' style='margin-right: 15px;cursor: pointer;color: #039cf8;display:none;'>撤回</span>";
                        }
                        html += "<span class='status_delete' data-id='" + value + "' >删除</span>";
                        return html;
                    }
                }
            ], //列
            silent: true, //刷新事件必须设置
            formatLoadingMessage: function () {
                return "请稍等，正在加载中...";
            },
            formatNoMatches: function () { //没有匹配的结果
                return '无符合条件的记录';
            },
            onLoadSuccess: function (data) {
                console.log(data);
                ActivityDetail.onLoadSuccessData = data.rows;
                console.log(ActivityDetail.onLoadSuccessData);

                $('.caret').remove();

                ActivityDetail.GetAdminActivityStatus(false);
            },
            onLoadError: function (data) {
                $('#productTable').bootstrapTable('removeAll');
            },
            // 1.点击每行进行函数的触发
            onClickRow: function (row, tr, flied) {
                // 书写自己的方法

            },
            //2. 点击前面的复选框进行对应的操作
            //点击全选框时触发的操作
            //点击全选框时触发的操作
            onCheckAll: function (rows) {

                // for (var i = 0; i < rows.length; i++) {
                //     dishes_list.UserIdsList.push(rows[i].User.Id);
                //     dishes_list.UserOpenIds.push(rows[i].User.OpenId);
                // }

            },
            onUncheckAll: function (rows) {

            },
            //点击每一个单选框时触发的操作
            onCheck: function (row) {
                var id = row.User.WId;
                if (ActivityDetail.UserIdsList.indexOf(id) == -1) {
                    ActivityDetail.UserIdsList.push(Number(id));
                }
            },
            //取消每一个单选框时对应的操作；
            onUncheck: function (row) {
                Array.prototype.remove = function (val) {
                    var index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                ActivityDetail.UserIdsList.remove(Number(row.User.Id));
            }
        });
    },
    //bootstrap table post 参数 queryParams
    queryParams: function (params) {
        //配置参数
        //方法名
        var methodName = "/AdminActivity/GetAdminActivityAllWorkList";

        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            minSize: $("#leftLabel").val(),
            maxSize: $("#rightLabel").val(),
            minPrice: $("#priceleftLabel").val(),
            maxPrice: $("#pricerightLabel").val(),
            Type: $("#State").find(".active").find("a").attr("data-type"),
            OrderModel: $("#sorting").val(),
            AId: Common.getUrlParam("id"),
            GId: $("#TypeList").val(),
            Title: $("#Title").val(),
            StartTime: $("#start").val(),
            EndTime: $("#end").val(),
            Status: $("#Status").val(),
            Page: {
                PageSize: params.limit, //页面大小,
                PageIndex: (params.offset / params.limit) + 1, //页码
            }
        };
        return temp;
    },
    // 用于server 分页，表格数据量太大的话 不想一次查询所有数据，可以使用server分页查询，数据量小的话可以直接把sidePagination: "server"  改为 sidePagination: "client" ，同时去掉responseHandler: responseHandler就可以了，
    responseHandler: function (res) {
        if (res.Data != null) {
            console.log(res);
            res.Data.Total
            $(".paginalNumber").text(res.Data.Total);
            return {
                "rows": res.Data.List,
                "total": res.Data.Total
            };
        } else {
            return {
                "rows": [],
                "total": 0
            };
        }
    },
    //表格刷新(直接刷新)
    refreshQuery: function (parame) {
        //方法名
        var methodName = "/AdminActivity/GetAdminActivityAllWorkList";

        if (parame == "" || parame == undefined) {
            var obj = {
                Type: $("#State").find(".active").find("a").attr("data-type"),
                OrderModel: $("#sorting").val(),
                AId: Common.getUrlParam("id"),
                GId: $("#TypeList").val(),
                Title: $("#Title").val()
            };
        } else {
            obj = parame;
        }

        $('#productTable').bootstrapTable(
            "refresh", {
                url: SignRequest.urlPrefix + methodName,
                query: obj
            }
        );
    },
    //表格刷新(先销毁后初始化)
    projectQuery: function (parame) {
        //方法名
        var methodName = "/AdminActivity/GetAdminActivityAllWorkList";
        if (parame == "" || parame == undefined) {
            var obj = {
                Type: $("#State").find(".active").find("a").attr("data-type"),
                OrderModel: $("#sorting").val(),
                AId: Common.getUrlParam("id"),
                GId: $("#TypeList").val(),
                Title: $("#Title").val(),
                Page: {
                    PageSize: $("#pagesize_dropdown").val(), //页面大小,
                    PageIndex: Number($(".pagination").find(".active").text()), //页码
                }
            };
        } else {
            obj = parame;
        }

        $('#productTable').bootstrapTable(
            "destroy", {
                url: SignRequest.urlPrefix + methodName,
                query: obj
            }
        );

        ActivityDetail.initBootstrapTable();


    },
    //初始化日期控件：日期时间
    initLaydateWithTime: function () {
        //日期范围限制
        var start = laydate.render({
            elem: '#start',
            type: 'datetime',
            max: 1, //最大日期
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
        });



    },
}