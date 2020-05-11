$(function () {
    ProductionList.init();
})

var ProductionList = {
    ImgList: [],
    ImgTitle: "",
    ImgIndex: 0,
    init: function () {
        //全选
        $("#selAll").on("change", function () {
            if ($(this).is(':checked')) {
                $(".checkbox").prop("checked", true);
            } else {
                $(".checkbox").prop("checked", false);
            }
        });

        //图片模态框
        $("#productTable").on("click", ".chairImg", function () {
            // 记录当前图片数据
            ProductionList.ImgIndex = $(this).parents("td").find("span").index($(this).parent()) + 1;
            ProductionList.ImgTitle = $(this).attr("data-title");
            ProductionList.ImgList = JSON.parse($(this).attr("data-ImgList"));
            $(".preview_img").attr("src", $(this).attr("src"));
            $(".preview_span").text($(this).attr("title") + ".jpg");
            $("#DownloadImg").attr("data-href", $(this).attr("data-src"));

            var data = ProductionList.ImgList[ProductionList.ImgIndex-1];
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

        //上一页
        $("body").on("click", ".previous_page", function () {
            if (ProductionList.ImgIndex - 1 < 1) {
                return false;
            }
            ProductionList.ImgIndex = ProductionList.ImgIndex - 1;
            $(".preview_img").attr("src", ProductionList.ImgList[ProductionList.ImgIndex - 1].SimpleImgUrl);
            $(".preview_span").text(ProductionList.ImgTitle + "-" + (ProductionList.ImgIndex) + ".jpg");
            $("#DownloadImg").attr("data-href", ProductionList.ImgList[ProductionList.ImgIndex - 1].ImgUrl);
            var data = ProductionList.ImgList[ProductionList.ImgIndex - 1];
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
            if (ProductionList.ImgIndex + 1 > ProductionList.ImgList.length) {
                return false;
            }
            ProductionList.ImgIndex = ProductionList.ImgIndex + 1;
            $(".preview_img").attr("src", ProductionList.ImgList[ProductionList.ImgIndex - 1].SimpleImgUrl);
            $(".preview_span").text(ProductionList.ImgTitle + "-" + (ProductionList.ImgIndex) + ".jpg");
            $("#DownloadImg").attr("data-href", ProductionList.ImgList[ProductionList.ImgIndex - 1].ImgUrl);
            var data = ProductionList.ImgList[ProductionList.ImgIndex - 1];
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
            ProductionList.DownloadImg();
        })

        //单个删除
        $("#productTable").on("click", ".status_delete", function () {
            var PId = [$(this).attr("data-id")];
            Common.confirmDialog("确认进行删除吗？", function () {
                ProductionList.deleteProduct(PId);
            });
        });
        //多个删除
        $("#delete").on("click", function () {
            Common.confirmDialog("确认对选中的数据进行删除吗？", function () {
                ProductionList.deleteProduct(ProductionList.getSelectedData());
            });
        });

        //表格分页每页显示数据
        $("#pagesize_dropdown").on("change", function () {
            ProductionList.projectQuery();
        });


        // 点击返回列表页
        $(".info-title").click(function () {
            window.history.go(-1);
        });



        $("#productTable").on("click", ".recommended", function () {
            var PId = $(this).attr("data-id");
            var status = $(this).attr("data-status");
            if (status == 1) {
                Common.confirmDialog("确认推荐吗？", function () {
                    ProductionList.UpdateAdminWorkRecommended(PId, status);
                });
            } else {
                Common.confirmDialog("确认取消推荐吗？", function () {
                    ProductionList.UpdateAdminWorkRecommended(PId, status);
                });
            }

        });

        ProductionList.initBootstrapTable();
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
    // 删除
    deleteProduct: function (PId) {
        var methodName = "/AdminWorks/DeleteAdminWork";
        var data = {
            Ids: PId
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("删除成功", function () {
                    ProductionList.projectQuery();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 后台更新作品推荐状态
    UpdateAdminWorkRecommended: function (WId, Status) {
        var methodName = "/AdminWorks/UpdateAdminWorkRecommended";
        var data = {
            WId: WId,
            Status: Status
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg(data.Data, function () {
                    ProductionList.projectQuery();
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    //bootstrapTable
    initBootstrapTable: function () {
        $('#productTable').bootstrapTable({
            method: 'post',
            url: SignRequest.urlPrefix + '/AdminWorks/GetAdminUserWorkList',
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
            queryParams: ProductionList.queryParams, //参数
            queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求
            toolbar: "#toolbar", //设置工具栏的Id或者class
            responseHandler: ProductionList.responseHandler,
            columns: [{
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
                    field: 'Score',
                    title: '评分',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value;
                    }
                },
                {
                    field: 'LikeCount',
                    title: '点赞',
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
                        html += "<a href='/production/productionDetail?id=" + value + "' style='margin-right: 15px;cursor: pointer;color: #039cf8;'   data-id='" + value + "'>详情</a>";
                        html += "<span class='status_delete' data-id='" + value + "' style='margin-left: 10px;'>删除</span><br>";
                        if (row.Status == 0) {
                            html += "<span class='recommended' data-id='" + value + "' data-status='1' style='margin-right: 15px;cursor: pointer;color: #039cf8;'>推荐</span>";
                        } else if (row.Status == 1) {
                            html += "<span class='recommended' data-id='" + value + "' data-status='0' style='margin-right: 15px;cursor: pointer;color: #039cf8;'>取消推荐</span>";
                        }
                        html += "<a href='/production/commentsList?id=" + value + "' style='cursor: pointer;color: #039cf8;' data-id='" + value + "'>查看评论</a>";
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
        var methodName = "/AdminWorks/GetAdminUserWorkList";

        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            minSize: $("#leftLabel").val(),
            maxSize: $("#rightLabel").val(),
            minPrice: $("#priceleftLabel").val(),
            maxPrice: $("#pricerightLabel").val(),
            UId: Common.getUrlParam("id"),
            PageModel: {
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
        var methodName = "/AdminWorks/GetAdminUserWorkList";

        if (parame == "" || parame == undefined) {
            var obj = {
                UId: Common.getUrlParam("id")
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
        var methodName = "/AdminWorks/GetAdminUserWorkList";

        if (parame == "" || parame == undefined) {
            var obj = {
                UId: Common.getUrlParam("id"),
                PageModel: {
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

        ProductionList.initBootstrapTable();

    },

}