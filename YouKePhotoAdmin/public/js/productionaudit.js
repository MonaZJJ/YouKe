$(function () {
    Productionaudit.init();
})

var Productionaudit = {
    columns: [],
    ImgList: [],
    ImgTitle: "",
    ImgIndex: 0,
    ActivityTpl: `
        {{each GetAdminActivityNameList as value i}}
            <option value="{{value.ActivityId}}">{{value.Title}}</option>
        {{/each}}
    `,
    onLoadSuccessData: [],
    trIndex: 0,
    init: function () {
        // 日期控件初始化
        Productionaudit.initLaydateWithTime();
        //全选
        $("#selAll").on("change", function () {
            if ($(this).is(':checked')) {
                $(".checkbox").prop("checked", true);
            } else {
                $(".checkbox").prop("checked", false);
            }
        });


        //多个删除
        $("#Batchreview").on("click", function () {
            Productionaudit.BatchUpdateAdminTodoWorkStatus(Productionaudit.getSelectedData());

        });

        //表格分页每页显示数据
        $("#pagesize_dropdown").on("change", function () {
            Productionaudit.projectQuery();
        });
        //图片模态框
        $("#productTable").on("click", ".chairImg", function () {
            Productionaudit.trIndex = $(this).parents("tr").attr("data-index");
            // 记录当前图片数据

            Productionaudit.ImgIndex = $(this).parents("td").find("span").index($(this).parent()) + 1;
            Productionaudit.ImgTitle = $(this).attr("data-title");
            Productionaudit.ImgList = JSON.parse($(this).attr("data-ImgList"));
            $(".preview_img").attr("src", $(this).attr("src"));
            $(".preview_span").text($(this).attr("title") + ".jpg");
            $("#DownloadImg").attr("data-href", $(this).attr("data-src"));
            $(".undateaudit").attr("data-id",  Productionaudit.onLoadSuccessData[Productionaudit.trIndex].WId).show();
            var data = Productionaudit.onLoadSuccessData[Productionaudit.trIndex].ImgList[Productionaudit.ImgIndex-1];
            var img_msg = `
            <p style="display:inline-block;width:100%;margin:0;">
                <span style='color: #3c8dbc;float:left;'>设备型号：${data.Device}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>镜头：${data.Camera}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>光圈：${data.Aperture}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>曝光补偿：${data.ExposureCompensation}</span>
            </p>
            <p style="display:inline-block;width:100%;margin:0;">
                <span style='color: #3c8dbc;float:left;'>焦距：${data.Foci}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>ISO：${data.ISO}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>拍照时间：${data.ShootingTime}</span>
                <span style='margin-left: 10px;color: #3c8dbc;float:left;'>快门：${data.Shutter}</span>
            </p>
            `;
            $(".img_msg").html("");
            $(img_msg).appendTo(".img_msg");
        });

        //上一页
        $("body").on("click", ".previous_page", function () {
            var ImgList = Productionaudit.onLoadSuccessData[Productionaudit.trIndex].ImgList;
            if (Productionaudit.ImgIndex - 1 < 1) {
                if (Productionaudit.trIndex == 0) {
                    Common.showErrorMsg("已是此页第一条");
                    return false;
                }
                Productionaudit.trIndex--;
                ImgList = Productionaudit.onLoadSuccessData[Productionaudit.trIndex].ImgList;
                Productionaudit.ImgIndex = ImgList.length;
                $(".undateaudit").show();
            } else {
                Productionaudit.ImgIndex = Productionaudit.ImgIndex - 1;
            }
            $(".preview_img").attr("src", ImgList[Productionaudit.ImgIndex - 1].SimpleImgUrl);
            $(".preview_span").text(Productionaudit.onLoadSuccessData[Productionaudit.trIndex].Title + "-" + (Productionaudit.ImgIndex) + ".jpg");
            $("#DownloadImg").attr("data-href", ImgList[Productionaudit.ImgIndex - 1].ImgUrl);
            $(".undateaudit").attr("data-id", Productionaudit.onLoadSuccessData[Productionaudit.trIndex].WId);
            var data = Productionaudit.onLoadSuccessData[Productionaudit.trIndex].ImgList[Productionaudit.ImgIndex - 1];
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
            var ImgList = Productionaudit.onLoadSuccessData[Productionaudit.trIndex].ImgList;
            if (Productionaudit.ImgIndex + 1 > ImgList.length) {
                if (Productionaudit.trIndex == Productionaudit.onLoadSuccessData.length - 1) {
                    Common.showErrorMsg("已是此页最后一条");
                    return false;
                }
                Productionaudit.trIndex++;
                ImgList = Productionaudit.onLoadSuccessData[Productionaudit.trIndex].ImgList;
                Productionaudit.ImgIndex = 0;
                $(".undateaudit").show();
            } else {
                Productionaudit.ImgIndex++;
            }
            if (Productionaudit.ImgIndex == 0) {
                $(".preview_img").attr("src", ImgList[Productionaudit.ImgIndex].SimpleImgUrl);
                $(".preview_span").text(Productionaudit.onLoadSuccessData[Productionaudit.trIndex].Title + "-" + (Productionaudit.ImgIndex + 1) + ".jpg");
                $("#DownloadImg").attr("data-href", ImgList[Productionaudit.ImgIndex].ImgUrl);
                Productionaudit.ImgIndex++;
            } else {
                $(".preview_img").attr("src", ImgList[Productionaudit.ImgIndex - 1].SimpleImgUrl);
                $(".preview_span").text(Productionaudit.onLoadSuccessData[Productionaudit.trIndex].Title + "-" + (Productionaudit.ImgIndex) + ".jpg");
                $("#DownloadImg").attr("data-href", ImgList[Productionaudit.ImgIndex - 1].ImgUrl);
            }

            $(".undateaudit").attr("data-id", Productionaudit.onLoadSuccessData[Productionaudit.trIndex].WId);
            var data = Productionaudit.onLoadSuccessData[Productionaudit.trIndex].ImgList[Productionaudit.ImgIndex - 1];
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

        $('#ifSureSendModal').on('show.bs.modal', function (e) {
            $(".undateaudit").show();
        })


        $("#DownloadImg").click(function () {
            Productionaudit.DownloadImg();
        })

        // 查詢
        $("#search").on("click", function () {
            Productionaudit.projectQuery();
        });


        // 审核
        $("body").on("click", ".audit", function () {
            var WId = $(this).attr("data-id");
            var staut = $(this).attr("data-staut");
            if ($(this).attr("data-staut") == "1") {
                Common.confirmDialog("确认对选中的数据进行审核通过吗？", function () {
                    Productionaudit.UpdateAdminTodoWorkStatus(WId, staut);
                });
            } else {
                Common.confirmDialog("确认对选中的数据进行审核拒绝吗？", function () {
                    Productionaudit.UpdateAdminTodoWorkStatus(WId, staut);
                });
            }
        });
        $("body").on("click", ".undateaudit", function () {
            var WId = $(this).attr("data-id");
            var staut = $(this).attr("data-staut");
            if ($(this).attr("data-staut") == "1") {
                Common.confirmDialog("确认对选中的数据进行审核通过吗？", function () {
                    Productionaudit.UpdateAdminTodoWorkStatus(WId, staut);
                });
            } else {
                Common.confirmDialog("确认对选中的数据进行审核拒绝吗？", function () {
                    Productionaudit.UpdateAdminTodoWorkStatus(WId, staut);
                });
            }
        });




        if (Common.getUrlParam("id")) {
            Productionaudit.columns = [{
                    field: 'WId',
                    title: '',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = '<input type="checkbox" class="checkbox" data-pid="' + value + '">'
                        return html;
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
                    title: '昵称',
                    align: 'left',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var e = '<span style="padding-left:30px;margin-right:-30px;"><img src=' + row.Avatar + ' class="" alt="暂无图片" style ="width: 56px;height: 56px;border-radius:50%;margin-right:20px;">' + row.NickName + '</span>';
                        return e;
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
                    field: 'CreateTimeStr',
                    title: '上传时间',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'GroupName',
                    title: '分组名称',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'WId',
                    title: '操作',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = "";
                        html += "<a href='/production/productionDetail?id=" + value + "' style='margin-right: 15px;cursor: pointer;color: #039cf8;' data-id='" + value + "'>详情</a>";
                        html += "<span class='audit' data-id='" + value + "' data-staut='1' style='margin-left: 10px;cursor: pointer;color: #039cf8;'>通过</span>";
                        html += "<span class='audit' data-id='" + value + "' data-staut='2' style='margin-left: 10px;cursor: pointer;color: #039cf8;'>拒绝</span>";
                        return html;
                    }
                }
            ]
        } else {
            Productionaudit.columns = [{
                    field: 'WId',
                    title: '',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = '<input type="checkbox" class="checkbox" data-pid="' + value + '">'
                        return html;
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
                    title: '昵称',
                    align: 'left',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var e = '<span style="padding-left:30px;margin-right:-30px;"><img src=' + row.Avatar + ' class="" alt="暂无图片" style ="width: 56px;height: 56px;border-radius:50%;margin-right:20px;">' + row.NickName + '</span>';
                        return e;
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
                    field: 'CreateTimeStr',
                    title: '上传时间',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'WId',
                    title: '操作',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        var html = "";
                        html += "<a href='/production/productionDetail?id=" + value + "' style='margin-right: 15px;cursor: pointer;color: #039cf8;' data-id='" + value + "'>详情</a>";
                        html += "<span class='audit' data-id='" + value + "' data-staut='1' style='margin-left: 10px;cursor: pointer;color: #039cf8;'>通过</span>";
                        html += "<span class='audit' data-id='" + value + "' data-staut='2' style='margin-left: 10px;cursor: pointer;color: #039cf8;'>拒绝</span>";
                        return html;
                    }
                }
            ]
        }

        // 点击返回列表页
        $(".info-title").click(function () {
            window.location.href = "/user/userList";
        });
        // Productionaudit.GetAdminActivityNameList();
        Productionaudit.initBootstrapTable();
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
    // 后台审核作品
    UpdateAdminTodoWorkStatus: function (WId, Staus) {
        var methodName = "/AdminWorks/UpdateAdminTodoWorkStatus";
        var data = {
            WId: WId,
            Staus: Staus
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg(data.Data, function () {
                    Productionaudit.projectQuery();
                    $(".undateaudit").hide();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 批量审核
    BatchUpdateAdminTodoWorkStatus: function (WId) {
        if (WId.length < 1) {
            Common.showErrorMsg("选择的数据最少一条");
            return false;
        }
        var methodName = "/AdminWorks/BatchUpdateAdminTodoWorkStatus";
        var data = {
            WIds: WId,
            Staus: $("#AuditList").val()
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg(data.Data, function () {
                    Productionaudit.projectQuery();
                    $("#addGrouping").modal("hide");
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 获取赛事列表接口
    GetAdminActivityNameList: function () {
        var methodName = "/AdminActivity/GetAdminActivityNameList";
        var data = {};
        SignRequest.set(methodName, data, function (data) {
            console.log(data.Data)
            if (data.Code == "100") {
                var render = template.compile(Productionaudit.ActivityTpl);
                var html = render(data.Data);
                $("#ActivityList").append(html);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //bootstrapTable
    initBootstrapTable: function () {
        $('#productTable').bootstrapTable({
            method: 'post',
            url: SignRequest.urlPrefix + '/AdminWorks/GetAdminTodoWorkList',
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
            queryParams: Productionaudit.queryParams, //参数
            queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求
            toolbar: "#toolbar", //设置工具栏的Id或者class
            responseHandler: Productionaudit.responseHandler,
            columns: Productionaudit.columns, //列
            silent: true, //刷新事件必须设置
            formatLoadingMessage: function () {
                return "请稍等，正在加载中...";
            },
            formatNoMatches: function () { //没有匹配的结果
                return '无符合条件的记录';
            },
            onLoadSuccess: function (data) {
                console.log(data);
                Productionaudit.onLoadSuccessData = data.rows;
                $('.caret').remove()

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


            },
            //取消每一个单选框时对应的操作；
            onUncheck: function (row) {
                Array.prototype.remove = function (val) {
                    var index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };

            }
        });
    },
    //bootstrap table post 参数 queryParams
    queryParams: function (params) {
        //配置参数
        //方法名
        var methodName = "/AdminWorks/GetAdminTodoWorkList";

        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            minSize: $("#leftLabel").val(),
            maxSize: $("#rightLabel").val(),
            minPrice: $("#priceleftLabel").val(),
            maxPrice: $("#pricerightLabel").val(),
            "StartTime": $("#start").val(),
            "EndTime": $("#end").val(),
            "AId": 0,
            PageModel: {
                PageSize: params.limit, //页面大小,
                PageIndex: (params.offset / params.limit) + 1, //页码
            }
        };
        if (Common.getUrlParam("id")) {
            temp.AId = Common.getUrlParam("id");
        } else {
            temp.AId = 0
        }
        return temp;
    },
    // 用于server 分页，表格数据量太大的话 不想一次查询所有数据，可以使用server分页查询，数据量小的话可以直接把sidePagination: "server"  改为 sidePagination: "client" ，同时去掉responseHandler: responseHandler就可以了，
    responseHandler: function (res) {
        if (res.Data != null) {
            console.log(res);
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
        var methodName = "/AdminWorks/GetAdminTodoWorkList";

        if (parame == "" || parame == undefined) {
            var obj = {
                "StartTime": $("#start").val(),
                "EndTime": $("#end").val(),
                // "AId": $("#ActivityList").val(),
                "AId": 0,
            };
            if (Common.getUrlParam("id")) {
                obj.AId = Common.getUrlParam("id");
            } else {
                obj.AId = 0
            }
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
        var methodName = "/AdminWorks/GetAdminTodoWorkList";

        if (parame == "" || parame == undefined) {
            var obj = {
                "StartTime": $("#start").val(),
                "EndTime": $("#end").val(),
                // "AId": $("#ActivityList").val(),
                "AId": 0,
                PageModel: {
                    PageSize: $("#pagesize_dropdown").val(), //页面大小,
                    PageIndex: Number($(".pagination").find(".active").text()), //页码
                }
            };
            if (Common.getUrlParam("id")) {
                obj.AId = Common.getUrlParam("id");
            } else {
                obj.AId = 0
            }
        } else {
            obj = parame;
        }

        $('#productTable').bootstrapTable(
            "destroy", {
                url: SignRequest.urlPrefix + methodName,
                query: obj
            }
        );

        Productionaudit.initBootstrapTable();

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
        })
    },
}