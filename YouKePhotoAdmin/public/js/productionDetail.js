var ProductionDetail = {
    ImgList: [],
    ImgTitle: "",
    ImgIndex: 0,
    productionDetailTpl: `
        <div class="tab-pane active" id="first">
        <div>
            <ul>
                <li>
                    <div class="box box-solid">
                        <div class="box-header">
                            <h3 class="box-title">
                                基本信息
                            </h3>
                            <div class="pull-right">
                                <button type="button" class="btn btn-sm pull-right btn-primary operate-btn" data-widget="collapse">
                                    <i class="fa fa-minus"></i>
                                </button>
                            </div>
                        </div>
                        <div class="box-body">
                            <div class="form-box form-horizontal">
                                <div class="form-group">
                                    <span><img src='{{Avatar}}' class="chairImg" alt="暂无图片" style="width: 78px;height: 78px;border-radius:50%;margin-right:13px;">{{NickName}}</span>

                                </div>
                                <div class="form-group">
                                    <label class=" control-label" style="float:left;">
                                        标题：</label>
                                    <div class="col-md-4">
                                        <span class="form-control">{{Title}}</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class=" control-label" style="float:left;">
                                        描述：</label>
                                    <div class="col-md-4">
                                        <span class="form-control">{{Desc}}</span>
                                    </div>
                                </div>
                                {{if AId==0}}
                                <div class="form-group">
                                    <label class=" control-label" style="float:left;">
                                        机型：</label>
                                    <div class="col-md-4">
                                        <span class="form-control">{{PhoneModel.Name}}</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class=" control-label" style="float:left;">
                                        标签：</label>
                                    <div class="tag_list clearfix">
                                        {{each TabList as v i}}
                                            <div class="tag_box" data-id="{{v.TabId}}" data-toggle="modal" data-target="#addGrouping">{{v.TabName}}</div>
                                        {{/each}}
                                    </div>
                                    <div class="add_tag_box" data-toggle="modal" data-target="#addGrouping">+</div>
                                </div>
                                {{/if}}
                               {{if AId>0}}
                                <div class="form-group">
                                    <label class=" control-label" style="float:left;">
                                        参加赛事：</label>
                                    <div class="col-md-4">
                                        <span class="form-control">{{AName}}</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class=" control-label" style="float:left;">
                                        获奖情况：</label>
                                    <div class="col-md-4">
                                        <span class="form-control">{{PrizeName}}</span>
                                    </div>
                                </div>
                                {{/if}}
                                {{if GId>0}}
                                <div class="form-group">
                                    <label class=" control-label" style="float:left;">
                                    组别：</label>
                                    <div class="col-md-4">
                                        <span class="form-control">{{GName}}</span>
                                    </div>
                                </div>
                                {{/if}}
                                
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="box box-solid">
                        <div class="box-header">
                            <h3 class="box-title">
                                作品列表
                            </h3>
                            <div class="pull-right">
                                <button type="button" class="btn btn-sm pull-right btn-primary operate-btn" data-widget="collapse">
                                    <i class="fa fa-minus"></i>
                                </button>
                            </div>
                        </div>
                        <div class="box-body">
                            <div class="form-box form-horizontal">
                                <div id="ProductionDetail" class="clearfix">
                                    {{each ImgList as j t}}
                                        <div class="productionbox">
                                            <img class="chairImg" style="min-width:100px;min-height:100px;" data-title="{{Title}}" data-ImgList="{{ImgList|stringify}}"  data-toggle="modal" data-target="#ifSureSendModal" data-src="{{j.ImgUrl}}" src="{{j.SimpleImgUrl}}" alt="" title="{{Title}}-{{t+1}}">
                                        </div>
                                    {{/each}}
                                </div>

                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    `,
    tagTpl: `
    <option selected="selected" value="0">请选择标签</option>
        {{each AdminTabNameList as value i}}
            <option value="{{value.TabId}}">{{value.TabName}}</option>
        {{/each}}
    `,
    TagId: "",
    init: function () {
        //使用辅助函数
        template.defaults.imports.stringify = ProductionDetail.stringify;

        // 点击返回列表页
        $(".info-title").click(function () {
            window.history.go(-1);
        });

        $('#addGrouping').on('show.bs.modal', function (e) {
            ProductionDetail.GetTabList();
        });
        $('#addGrouping').on('hide.bs.modal', function (e) {
            ProductionDetail.GetAdminWorkInfo();
            ProductionDetail.TagId = "";
            $(".tag_title").text("添加标签");
        });

        $("#creatTabNameBtn").click(function () {
            if ($('#TagList').val() == "0") {
                Common.showInfoMsg('请选择标签')
                return false;
            }

            if (ProductionDetail.TagId == "") {
                ProductionDetail.AddAdminWorkTab();
            } else {
                ProductionDetail.UpdateAdminWorkTab();
            }


        });


        $("body").on("click", ".tag_box", function () {
            ProductionDetail.TagId = $(this).attr("data-id");
            $(".tag_title").text("编辑标签");
        });


        //图片模态框
        $("#productionDetail").on("click", ".chairImg", function () {
            // 记录当前图片数据
            ProductionDetail.ImgIndex = $(this).parents("#ProductionDetail").find(".productionbox").index($(this).parent());
            ProductionDetail.ImgTitle = $(this).attr("data-title");
            ProductionDetail.ImgList = JSON.parse($(this).attr("data-ImgList"));
            $(".preview_img").attr("src", $(this).attr("src"));
            $(".preview_span").text($(this).attr("title") + ".jpg");
            $("#DownloadImg").attr("data-href", $(this).attr("data-src"));

            var data = ProductionDetail.ImgList[ProductionDetail.ImgIndex];
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

            if (ProductionDetail.ImgIndex - 1 < 0) {
                return false;
            }

            ProductionDetail.ImgIndex--;
            $(".preview_img").attr("src", ProductionDetail.ImgList[ProductionDetail.ImgIndex].SimpleImgUrl);
            $(".preview_span").text(ProductionDetail.ImgTitle + "-" + (ProductionDetail.ImgIndex + 1) + ".jpg");
            $("#DownloadImg").attr("data-href", ProductionDetail.ImgList[ProductionDetail.ImgIndex].ImgUrl);

            var data = ProductionDetail.ImgList[ProductionDetail.ImgIndex];
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
            if (ProductionDetail.ImgIndex + 1 > ProductionDetail.ImgList.length - 1) {
                return false;
            }
            ProductionDetail.ImgIndex++;
            $(".preview_img").attr("src", ProductionDetail.ImgList[ProductionDetail.ImgIndex].SimpleImgUrl);
            $(".preview_span").text(ProductionDetail.ImgTitle + "-" + (ProductionDetail.ImgIndex + 1) + ".jpg");
            $("#DownloadImg").attr("data-href", ProductionDetail.ImgList[ProductionDetail.ImgIndex].ImgUrl);

            var data = ProductionDetail.ImgList[ProductionDetail.ImgIndex];
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
            ProductionDetail.DownloadImg();
        })

        // 获取后台作品详情
        ProductionDetail.GetAdminWorkInfo();
    },
    stringify: function (str) {
        return JSON.stringify(str);
    },
    DownloadImg: function () {
        let src = $(".preview_img").attr("src");
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
    // 后台作品详情
    GetAdminWorkInfo: function () {
        var methodName = "/AdminWorks/GetAdminWorkInfo";
        var data = {
            WId: Common.getUrlParam("id")
        };
        SignRequest.set(methodName, data, function (data) {
            console.log(data.Data)
            if (data.Code == "100") {
                var render = template.compile(ProductionDetail.productionDetailTpl);
                var html = render(data.Data);
                $("#productionDetail").html(html);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 获取标签列表接口
    GetTabList: function () {
        var methodName = "/AdminTab/GetAdminTabNameList";
        var data = {};
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                var render = template.compile(ProductionDetail.tagTpl);
                var html = render(data.Data);
                $("#TagList").html(html);
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 后台添加作品标签
    AddAdminWorkTab: function () {
        var methodName = "/AdminWorks/AddAdminWorkTab";
        var data = {
            WId: Common.getUrlParam("id"),
            TId: $("#TagList").val()
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("添加成功", function () {
                    $('#addGrouping').modal("hide");
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },
    // 后台编辑作品标签
    UpdateAdminWorkTab: function () {
        var methodName = "/AdminWorks/UpdateAdminWorkTab";
        var data = {
            WId: Common.getUrlParam("id"),
            TId: ProductionDetail.TagId,
            NewTId: $("#TagList").val()
        };
        SignRequest.set(methodName, data, function (data) {
            if (data.Code == "100") {
                Common.showSuccessMsg("编辑成功", function () {
                    $('#addGrouping').modal("hide");
                });
            } else {
                Common.showErrorMsg(data.Message);
            }
        });
    },

}

$(function () {
    ProductionDetail.init();
})