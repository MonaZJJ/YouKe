var SignRequest = {
    signkey: "SIGNKEY=yk@456ww-45$45",
    token: "TOKEN=",
    timestamp: "TIMESTAMP=",

    // urlPrefix: "http://192.168.31.188:19124/api/admin", //api地址
    // urlPrefixNoAdmin: "http://192.168.31.188:19124/api", //api地址
    // urlPrefixNoApi: "http://192.168.31.188:19124",
    urlPrefix: "http://api.wzsjsy.com/api/admin", //api地址
    urlPrefixNoAdmin: "http://api.wzsjsy.com/api", //api地址
    urlPrefixNoApi: "http://api.wzsjsy.com/",
    //获取服务器时间
    severtime: function () {
        var dateTime;
        $.ajax({
            url: this.urlPrefixNoAdmin + '/Common/GetServerTime',
            type: "post",
            dataType: 'json',
            async: false,
            success: function (data) {
                dateTime = data;
            },
            error: function () {
                Common.showErrorMsg("无法获取服务器时间!");
            }
        });
        return dateTime;
    },
    //获取方法名
    methodname: function (method) {
        return "METHODNAME=" + method;
    },
    //获取Token
    getToken: function () {
        var gettoken = localStorage.getItem("token");
        return gettoken;
    },
    //设置Token
    setToken: function (token) {
        localStorage.setItem('token', token);
    },
    //获取用户Id
    getUserId: function () {
        var userId = localStorage.getItem("userId");
        // if (userId == "" || userId == null) {
        //     window.location.href = "/"
        // }
        return userId;
    },
    //设置用户Id
    setUserId: function (userId) {
        localStorage.setItem('userId', userId);
    },
    //MD5加密
    tokenmd5string2: function (method, dateTime) {
        var gettoken = this.getToken();

        //token为空不参与加密
        if (gettoken == "" || gettoken == null) {
            return this.signkey + ";" + this.timestamp + dateTime + ";" + this.methodname(method) + ";";
        }

        return this.signkey + ";" + this.timestamp + dateTime + ";" + this.methodname(method) + ";" + this.token + gettoken + ";";
    },
    //设置json数据
    getSign: function (method, dateTime) {
        var sMd5 = this.tokenmd5string2(method, dateTime);
        var iMd5 = $.md5(sMd5).toUpperCase();
        return iMd5;
    },
    //请求
    set: function (method, requestData, callback, errorCallback, noShowLoading) {

        //获取当前时间戳
        var timeStamp = Date.parse(new Date()) / 1000;

        //获取签名
        var sign = SignRequest.getSign("api/admin" + method, timeStamp);

        //获取请求数据
        var jsonData = JSON.stringify(requestData);

        //获取token
        var token = SignRequest.getToken();

        // 解决IE10以下不能请求
        jQuery.support.cors = true;

        $.ajax({
            url: this.urlPrefix + method + '',
            type: "post",
            dataType: 'json',
            contentType: "application/json ; charset=utf-8",
            data: jsonData,
            headers: {
                "TimeStamp": timeStamp,
                "Sign": sign,
                "MethodName": "api/admin" + method,
                "Token": SignRequest.getToken()
            },
            beforeSend: function () {
                if (!noShowLoading) {
                    Common.showLoading();
                }
            },
            success: function (data) {
                if ($.isFunction(callback)) {
                    callback(data);
                }
            },
            complete: function () {
                layer.close(Common.index);
            },
            error: function () {
                if ($.isFunction(errorCallback)) {
                    errorCallback();
                }
            },
            // 当响应对应的状态码时，执行对应的回调函数
            statusCode: {
                //未授权，跳转到登录页
                401: function (data) {
                    Layout.logout(true);
                }
            }
        });
    },
    //同步请求
    setAsync: function (method, requestData, callback, errorCallback) {

        //获取当前时间戳
        var timeStamp = Date.parse(new Date()) / 1000;

        //获取签名
        var sign = SignRequest.getSign("api/admin" + method, timeStamp);

        //获取请求数据
        var jsonData = JSON.stringify(requestData);

        // 解决IE10以下不能请求
        jQuery.support.cors = true;

        $.ajax({
            url: this.urlPrefix + method + '',
            async: false,
            type: "post",
            dataType: 'json',
            contentType: "application/json ; charset=utf-8",
            data: jsonData,
            headers: {
                "TimeStamp": timeStamp,
                "Sign": sign,
                "MethodName": "api/admin" + method,
                "Token": SignRequest.getToken()
            },
            //beforeSend: function () {
            //    var login = '<div id="showloding"><div class="mask" style="display: block;"></div><div style="position: fixed;left: 45%;top: 45%;z-index: 1006;"><img src="/Content/v1.0/images/login/loading.gif"></div></div>';
            //    $("body").append(login);
            //},
            success: function (data) {
                if ($.isFunction(callback)) {
                    callback(data);
                }
            },
            error: function () {
                if ($.isFunction(errorCallback)) {
                    errorCallback();
                }
            },
            // 当响应对应的状态码时，执行对应的回调函数
            statusCode: {
                //未授权，跳转到登录页
                401: function (data) {
                    Layout.logout(true);
                }
            }
        });
    },
    //请求不带admin
    setNoAdmin: function (method, requestData, callback, errorCallback) {

        //获取当前时间戳
        var timeStamp = Date.parse(new Date()) / 1000;

        //获取签名
        var sign = SignRequest.getSign("api" + method, timeStamp);

        //获取请求数据
        var jsonData = JSON.stringify(requestData);

        //默认加上请求头
        requestData.RequestHead = {
            TimeStamp: timeStamp,
            Sign: sign,
            MethodName: method,
            Token: SignRequest.getToken()
        };

        var jsonData = JSON.stringify(requestData);

        // 解决IE10以下不能请求
        jQuery.support.cors = true;

        $.ajax({
            url: this.urlPrefixNoAdmin + method + '',
            type: "post",
            dataType: 'json',
            contentType: "application/json ; charset=utf-8",
            data: jsonData,
            //beforeSend: function () {
            //    var login = '<div id="showloding"><div class="mask" style="display: block;"></div><div style="position: fixed;left: 45%;top: 45%;z-index: 1006;"><img src="/Content/v1.0/images/login/loading.gif"></div></div>';
            //    $("body").append(login);
            //},
            success: function (data) {
                if ($.isFunction(callback)) {
                    callback(data);
                }
            },
            error: function () {
                if ($.isFunction(errorCallback)) {
                    errorCallback();
                }
            },
            // 当响应对应的状态码时，执行对应的回调函数
            statusCode: {
                //未授权，跳转到登录页
                401: function (data) {
                    Layout.logout(true);
                }
            }
        });
    },
}