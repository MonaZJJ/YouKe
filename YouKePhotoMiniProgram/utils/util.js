//获取应用实例
var app = getApp();

//引入MD5
var md5 = require('md5.js');
var Promise = require("bluebird");

//格式化时间
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//格式化数字
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//通用接口请求方法
function netRequest(methodName, data, success, isLoading, content, fail, complete) {

  //获取当前时间戳  
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  console.log("当前时间戳为：" + timestamp);

  //获取签名
  var sign = "SIGNKEY=" + app.globalData.apiSignKey + ";TIMESTAMP=" + timestamp + ";" + "METHODNAME=" + methodName + ";";

  //本地取存储的token 
  var token = wx.getStorageSync('token');
  console.log("token:" + token);

  //token不为空则请求头携带token
  if (token != "" && token != null) {
    //如果token不为空对Token进行加密
    sign += "TOKEN=" + token + ";";
    sign = md5.hexMD5(sign).toUpperCase();
    console.log("加密后的sign:" + sign);

    var header = {
      'content-type': 'application/json',
      'TimeStamp': timestamp,
      'Sign': sign,
      'MethodName': methodName,
      'Token': token
    }
  } else {
    sign = md5.hexMD5(sign).toUpperCase();
    console.log("加密后的sign:" + sign);

    var header = {
      'content-type': 'application/json',
      'TimeStamp': timestamp,
      'Sign': sign,
      'MethodName': methodName
    }
  }

  //请求接口
  var url = app.globalData.apiSever + methodName;

  //默认显示加载中提示
  if (isLoading == undefined) {
    isLoading = true;
  }

  //显示加载中提示
  if (isLoading) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
  }

  wx.request({
    url: url,
    method: "POST",
    data: data,
    header: header,
    success: res => {
      if (token == "" || token == null) {
        console.log(res);
        console.log("未登录状态");
      }
      console.log(res);
      let data = res.data;
      if (res['statusCode'] === 200) {
        success(data);
      } else if (res['statusCode'] === 401) {

        //token不为空，并返回401时则清除token
        if (token != "" && token != null) {
          // wx.clearStorage();
          wx.removeStorage({
            key: 'token',
            success: function(res) {},
          })
        }

        if (content == undefined || content == "" || content == null) {
          content = "您还没登录，请登录后重试";
        }

        //接口返回401未授权，跳转到登录页面
        wx.showModal({
          title: '提示',
          content: content,
          showCancel: true,
          success: function(res) {
            if (res.confirm) {
              var targetUrl = getCurrentPageUrlWithArgs();
              console.log(targetUrl);
              wx.setStorage({
                key: 'targetUrl',
                data: targetUrl,
                success: function() {
                  // wx.redirectTo({
                  //   url: '/pages/login/login'
                  // })
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                }
              })
            }
          }
        });
      } else {
        if (typeof(fail) == "function") {
          fail(data);
        }
      }
    },
    fail: function() {
      if (typeof(fail) == "function") {
        fail(data);
      }
      // else{
      //   //网络错误弹窗提示
      //   wx.showModal({
      //     title: '提示',
      //     content: "网络异常，请稍后重试",
      //     showCancel: false
      //   });
      // }
    },
    complete: function() {
      if (typeof(complete) == "function") {
        complete(data);
      }

      //接口调用完成后隐藏加载提示
      if (isLoading) {
        wx.hideLoading();
      }
    }
  });
}

function getRequestHeader(methodName) {
  //获取当前时间戳  
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  console.log("当前时间戳为：" + timestamp);

  //获取签名
  var sign = "SIGNKEY=" + app.globalData.apiSignKey + ";TIMESTAMP=" + timestamp + ";" + "METHODNAME=" + methodName + ";";

  //本地取存储的token 
  var token = wx.getStorageSync('token');
  console.log("token:" + token);

  //token不为空则请求头携带token
  if (token != "" && token != null) {
    //如果token不为空对Token进行加密
    sign += "TOKEN=" + token + ";";
    sign = md5.hexMD5(sign).toUpperCase();
    console.log("加密后的sign:" + sign);

    var header = {
      'content-type': 'application/json',
      'TimeStamp': timestamp,
      'Sign': sign,
      'MethodName': methodName,
      'Token': token
    }
  } else {
    sign = md5.hexMD5(sign).toUpperCase();
    console.log("加密后的sign:" + sign);

    var header = {
      'content-type': 'application/json',
      'TimeStamp': timestamp,
      'Sign': sign,
      'MethodName': methodName
    }
  }
  return header;
}

/*获取当前页url*/
function getCurrentPageUrlStr() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var urlArr = url.split("pages/");
  var urlStr = urlArr[urlArr.length - 1];
  return urlStr
}

/*获取当前页url*/
function getCurrentPageUrl() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  var result = '/' + urlWithArgs;
  return result
}

/* 函数描述：作为上传文件时多文件上传的函数体；
 * 参数描述： 
 * uploadUrl是上传文件接口地址
 * header是httpheader
 * requestData是请求数据
 * filePaths是文件路径数组
 * successUp是成功上传的个数
 * failUp是上传失败的个数
 * i是文件路径数组的指标
 * length是文件路径数组的长度
 * uploadCompleteCallback是所有文件上传完毕的回调函数
 */
function uploadFiles(uploadUrl, header, filePaths, successUp, failUp, i, length, successCallback, uploadCompleteCallback) {

  var index = i + 1;

  wx.showLoading({
    title: '正在上传第' + index + '张',
  });

  wx.uploadFile({
    url: uploadUrl,
    filePath: filePaths[i],
    header: header,
    formData: {},
    name: 'file_' + i,
    success: (res) => {
      console.log("上传第" + index + "张图片返回结果", res);
      //上传完毕
      if (typeof(successCallback) == "function") {
        successCallback(res);
        successUp++;
      }
      i++;
      if (i == length) {
        //上传完毕
        if (typeof(uploadCompleteCallback) == "function") {
          uploadCompleteCallback(res);
        }
      } else { //递归调用uploadFiles函数
        this.uploadFiles(uploadUrl, header, filePaths, successUp, failUp, i, length, successCallback, uploadCompleteCallback);
      }
    },
    fail: (res) => {
      failUp++;
      wx.showModal({
        title: '提示',
        content: '第' + index + '张' + '上传出错，请重试',
        showCancel: false
      });
    },
    complete: (res) => {},
  });
}

module.exports = {
  netRequest: netRequest,
  formatTime: formatTime,
  getCurrentPageUrlStr: getCurrentPageUrlStr,
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
  Promise: Promise,
  getRequestHeader: getRequestHeader,
  uploadFiles: uploadFiles
}