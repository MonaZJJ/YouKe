//公共帮助
var Common = {
    imgUrlPrefix: "http://192.168.31.186:8077/",
    pageSize: 20,
    index: "",
    //显示提示消息
    showInfoMsg: function (msg, callBack, title, btnMsg) {
        if (title == null || title.length == 0) {
            title = "提示";
        }
        if (btnMsg == null || btnMsg.length == 0) {
            btnMsg = "好的";
        }
        swal({
            title: title,
            text: msg,
            type: "info",
            confirmButtonText: btnMsg,
        }).then(function (a) {
            if ($.isFunction(callBack)) {
                callBack();
            }
        });
    },
    //显示错误消息
    showErrorMsg: function (msg, callBack, title, btnMsg) {
        if (title == null || title.length == 0) {
            title = "错误";
        }
        if (btnMsg == null || btnMsg.length == 0) {
            btnMsg = "好的";
        }
        swal({
            title: title,
            text: msg,
            type: "error",
            confirmButtonText: btnMsg,
        }).then(function (a) {
            if ($.isFunction(callBack)) {
                callBack();
            }
        });
    },
    //显示成功消息
    showSuccessMsg: function (msg, callBack, title, btnMsg) {
        if (title == null || title.length == 0) {
            title = "成功";
        }
        if (btnMsg == null || btnMsg.length == 0) {
            btnMsg = "好的";
        }
        swal({
            title: title,
            text: msg,
            type: "success",
            confirmButtonText: btnMsg,
            timer: 1500
        }).then(function (a) {
            if ($.isFunction(callBack)) {
                callBack();
            }
        });
    },
    //显示成功消息
    showTimerSuccessMsg: function (msg, callBack, title, btnMsg) {
        if (title == null || title.length == 0) {
            title = "成功";
        }
        if (btnMsg == null || btnMsg.length == 0) {
            btnMsg = "好的";
        }
        swal({
            title: title,
            text: msg,
            type: "success",
            confirmButtonText: btnMsg,
            timer: 1000
        }).then(function (a) {
            if ($.isFunction(callBack)) {
                callBack();
            }
        });
    },
    //显示加载中的信息
    showLoading: function (msg, callBack, title, btnMsg) {
        // if (title == null || title.length == 0) {
        //     title = "加载中...";
        // }
        // swal({
        //     title: title,
        //     text: msg,
        //     imageUrl: "/public/images/flie_loading.gif",
        //     showConfirmButton: false,
        // }).then((a) => {
        //     if ($.isFunction(callBack)) {
        //         callBack();
        //     }
        // });
        Common.index = layer.load(3, {
            shade: [0.2, '#000'] //0.1透明度的白色背景
        })
    },
    //时间数据转换
    exchangeTimeData: function (data) {
        return data.replace("T", " ");
    },
    //截取时间
    interceptTime: function (data) {
        return Common.exchangeTimeData(data).substring(0, 19);
    },
    //确认提示框
    confirmDialog: function name(text, callBack, title, icon, confirmButtonText, cancelButtonText) {
        if (title == null || title.length == 0) {
            title = "警告";
        }
        if (icon == null || icon.length == 0) {
            icon = "warning";
        }
        if (confirmButtonText == null || confirmButtonText.length == 0) {
            confirmButtonText = "确认";
        }
        if (cancelButtonText == null || cancelButtonText.length == 0) {
            cancelButtonText = "取消";
        }

        swal({
            title: title,
            text: text,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            dangerMode: true,
        }).then(function (result) {
            console.log(result)
            if (result) {
                if ($.isFunction(callBack)) {
                    callBack();
                }
            } else {
                return;
            }
        });
    },
    //确认提示框
    confirmHtmlDialog: function name(htmlText, title, callBack, confirmButtonText, cancelButtonText) {
        if (title == null || title.length == 0) {
            title = "警告";
        }
        // if (icon == null || icon.length == 0) {
        //     icon = "warning";
        // }
        if (confirmButtonText == null || confirmButtonText.length == 0) {
            confirmButtonText = "确认";
        }
        if (cancelButtonText == null || cancelButtonText.length == 0) {
            cancelButtonText = "取消";
        }

        swal({
            title: title,
            html: htmlText,
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            confirmButtonColor: "#ff5849"
        }).then(function (result) {
            if (result) {
                if ($.isFunction(callBack)) {
                    callBack();
                }
            } else {
                return;
            }
        });
    },
    //获取cookie
    getCookie: function (Name) {
        var search = Name + "="
        var returnvalue = "";
        if (document.cookie.length > 0) {
            offset = document.cookie.indexOf(search)
            if (offset != -1) {
                // if cookie exists
                offset += search.length
                // set index of beginning of value
                end = document.cookie.indexOf(";", offset);
                // set index of end of cookie value
                if (end == -1)
                    end = document.cookie.length;
                returnvalue = unescape(document.cookie.substring(offset, end))
            }
        }
        return returnvalue;
    },
    //写cookies
    setCookie: function (name, value) {
        var exp = new Date();
        exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000); //coockie保存一天 
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    //上传图片结束
    uploadHeadPic: function (imgId, picId) {
        var uploader = WebUploader.create({

            // 选完文件后，是否自动上传。
            auto: true,

            // swf文件路径
            //swf: BASE_URL + '/js/Uploader.swf',

            // 文件接收服务端。
            server: InterfaceRequest.urlPrefix + "/Account/UploadImage",

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: picId,

            fileNumLimit: 1,

            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png' //指定文件格式，解决谷歌卡慢
            }
        });

        // 当有文件添加进来的时候
        uploader.on('fileQueued', function (file) {
            var $li = $(
                    '<div id="' + file.id + '" class="file-item thumbnail">' +
                    '<img>' +
                    '<div class="info">' + file.name + '</div>' +
                    '</div>'
                ),
                $img = $li.find('img');


            // $list为容器jQuery实例
            //$list.append( $li );


            thumbnailWidth = 100;
            thumbnailHeight = 100;

            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // thumbnailWidth x thumbnailHeight 为 100 x 100
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }

                $img.attr('src', src);
                $(imgId).attr('src', src);

            }, thumbnailWidth, thumbnailHeight);
        });


        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress span');

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<p class="progress"><span></span></p>')
                    .appendTo($li)
                    .find('span');
            }

            $percent.css('width', percentage * 100 + '%');
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on('uploadSuccess', function (file, response) {
            $(imgId).attr('data-pic', response.Data)
            $('#' + file.id).addClass('upload-state-done');
        });

        // 文件上传失败，显示上传出错。
        uploader.on('uploadError', function (file) {
            var $li = $('#' + file.id),
                $error = $li.find('div.error');

            // 避免重复创建
            if (!$error.length) {
                $error = $('<div class="error"></div>').appendTo($li);
            }

            $error.text('上传失败');
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').remove();
        });
    },
    //获取省列表
    getProvinceList: function () {
        //方法名
        var methodName = "/Tool/ProvinceList";

        //获取省列表
        var provinceList;

        //请求接口
        InterfaceRequest.SetSync(methodName, "", function (data) {
            if (data.Code == "100") {
                provinceList = data.Data.RegionInfoList;
            } else {
                Common.dialog("提示", data.Message);
            }
        });

        return provinceList;
    },
    //获取市列表
    getCityList: function (pId) {
        //方法名
        var methodName = "/Tool/CityList";

        //获取省列表
        var cityList;

        //请求数据
        var data = {
            ProvinceId: pId
        };

        //请求接口
        InterfaceRequest.SetSync(methodName, data, function (data) {
            if (data.Code == "100") {
                cityList = data.Data.RegionInfoList;
            } else {
                Common.dialog("提示", data.Message);
            }
        });

        return cityList;
    },
    //获取市列表
    getRegionList: function (pId) {
        //方法名
        var methodName = "/Tool/CountyList";
        //获取省列表
        var cityList;
        //请求数据
        var data = {
            CityId: pId
        };
        //请求接口
        InterfaceRequest.SetSync(methodName, data, function (data) {
            if (data.Code == "100") {
                cityList = data.Data.RegionInfoList;
            } else {
                Common.dialog("提示", data.Message);
            }
        });
        return cityList;
    },
    //获取Jquery对象
    getJqueryObj: function (ele) {
        //是ID
        if (typeof ele == "string") {
            if (ele.indexOf("#") == 0) {
                ele = $(ele);
            } else {
                ele = $("#" + ele);
            }
        }
        //是dom对象
        if ((ele instanceof jQuery) == false) {
            ele = $(ele);
        }
        return ele;
    },
    getUrlParam: function (key) {
        // 获取参数
        var url = window.location.search;
        // 正则筛选地址栏
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        // 匹配目标参数
        var result = url.substr(1).match(reg);
        //返回参数值
        return result ? decodeURIComponent(result[2]) : null;
    },
    //超出显示省略号
    overShowEllipsis: function (text, maxLen) {
        if (text.length > maxLen) {
            return text.substring(0, maxLen) + "...";
        } else {
            return text;
        }
    },
    //是否PC
    isPC: function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    },
    //接口商品图片url转换
    convertProductImgUrl: function (storeId, imgUrl, imgSize) {
        imgUrl = Common.imgUrlPrefix + "upload/product/show/" + imgSize + "/" + imgUrl;
        return imgUrl;
    },
    //接口Banner图片url转换
    convertBannerImgUrl: function (imgUrl) {
        imgUrl = Common.imgUrlPrefix + "upload/banner/" + imgUrl;
        return imgUrl;
    },
    //接口广告图片url转换
    convertAdvertImgUrl: function (imgUrl) {
        imgUrl = Common.imgUrlPrefix + "upload/adv/" + imgUrl;
        return imgUrl;
    },
    //接口分类图片url转换
    convertClassifyImgUrl: function (imgUrl) {
        imgUrl = Common.imgUrlPrefix + "upload/category/" + imgUrl;
        return imgUrl;
    },
    //接口帮助图片url转换
    convertHelpImgUrl: function (imgUrl) {
        imgUrl = Common.imgUrlPrefix + "upload/help/" + imgUrl;
        return imgUrl;
    },
    //会员图片url转换
    convertMemberImgUrl: function (imgUrl) {
        imgUrl = Common.imgUrlPrefix + imgUrl;
        return imgUrl;
    },
    //获取jq对象
    getJqueryObj: function (ele) {
        return $(ele);
    },
    //时间数据转换
    exchangeTimeData: function (data) {
        return data.replace("T", " ");
    },
    //通知时间处理，时间格式：12-05
    convertNotificationTime: function (data) {
        return data.substring(5, 10);
    },
    //通知内页时间处理,时间格式：12-05 17:55
    convertInformationTime: function (data) {
        return Common.exchangeTimeData(data).substring(5, 16);
    },
    //获取分页当前页数(jquery分页插件)
    getCurrentPageIndex: function () {
        var thisPage = 1;
        for (var j = 0; j < $(".current").length; j++) {
            if (!$(".current").eq(j).hasClass("prev") && !$(".current").eq(j).hasClass("next")) {
                thisPage = parseInt($(".current").eq(j).text());
            }
        }
        return thisPage;
    },
    //初始化日期控件：日期
    initLaydate: function () {
        //日期范围限制
        var start = laydate.render({
            elem: '#start',
            type: 'date',
            max: 0, //最大日期
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
            type: 'date',
            max: 0,
            istoday: false,
            done: function (value, date) {
                if (value != "") {
                    date.month = date.month - 1;
                    start.config.max = date; //结束日选好后，重置开始日的最大日期
                }
            }
        })
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
            max: 1,
            istoday: false,
            done: function (value, date) {
                if (value != "") {
                    date.month = date.month - 1;
                    start.config.max = date; //结束日选好后，重置开始日的最大日期
                }
            }
        })
    },
    // 获取请求头
    getRequestHeadValue: function (method) {
        //获取服务器时间戳
        var timeStamp = SignRequest.severtime();

        //获取签名
        var sign = SignRequest.getSign(method, timeStamp);

        //默认加上请求头
        var requestHead = {
            TimeStamp: timeStamp,
            Sign: sign,
            MethodName: method,
            Token: SignRequest.getToken()
        };
        return requestHead;
    },
    // 初始化switch控件
    initSwitch: function () {
        $(".switch").on("click", function () {
            if ($(this).hasClass("switch-on")) {
                $(this).removeClass("switch-on");
            } else {
                $(this).addClass("switch-on");
            }
        })
    },
    //侧边栏二级选中
    selectSecondSide: function (url) {
        var currentUrl = window.location.pathname;
        if (currentUrl == url) {
            return 'active'
        } else {
            return ''
        }
    },
    //侧边栏一级选中
    selectFirstSide: function (url) {
        var currentUrl = window.location.pathname;

        if (url == "") {
            return ''
        } else if (url == "/" && currentUrl != "/") {
            return ''
        }

        if (currentUrl.indexOf(url) > -1) {
            return 'active'
        } else {
            return ''
        }
    },
    //一级菜单的地址
    selectFirstUrl: function (url) {
        if (url == "/") {
            return "/"
        } else {
            return "#"
        }
    },
    //获取完整文件地址
    getFullFileUrl: function (url) {
        if (url == "" || url == undefined) {
            return;
        }
        return SignRequest.urlPrefixNoApi + url;

    }
};