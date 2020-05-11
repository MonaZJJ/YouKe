//获取应用实例
const app = getApp();

var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    encryptedData: "",
    iv: "",
    sessionId: ""

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },
  //微信授权登录，获取用户信息
  weixinAuthLogin: function (e) {
    var that = this;

    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    wx.login({
      success: function (r) {
        if (r.code) {
          var code = r.code; //登录凭证
          console.log('获取用户登录凭证：' + code);
          if (code) {
            that.setData({
              code: code,
            }, function () {
              wx.getUserInfo({
                success: function (res) {
                  that.setData({
                    encryptedData: res.encryptedData,
                    iv: res.iv
                  }, function () {
                    that.userLogin();
                  })
                }
              })
            });
          } else {
            console.log('获取用户登录态失败！' + r.errMsg)
          }
        } else { }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  //调用后台接口登录
  userLogin: function () {
    var that = this;
    var url = '/WxOpen/OnLogin';
    //请求数据
    var requestData = {
      Code: that.data.code
    };
    //请求接口
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        that.setData({
          sessionId: data.Data.SessionId
        }, function () {
          that.submitUserInfo();
        })
      } else {
        that.setData({
          code: ""
        })
      }
    });
  },
  // 提交用户信息
  submitUserInfo: function () {
    var that = this;
    var url = '/WxOpen/GetUserInfo';
    //请求数据
    var requestData = {
      EncryptedData: that.data.encryptedData,
      Iv: that.data.iv,
      SessionId: that.data.sessionId
    };
    //请求接口
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        wx.setStorageSync("token", data.Data.Token);
        wx.setStorageSync("uid", data.Data.UId);
        var targetUrl = wx.getStorageSync("targetUrl");
        if (targetUrl.indexOf('/pages/index/index') > -1 || targetUrl.indexOf('/pages/match/match') > -1 || targetUrl.indexOf('/pages/member/member') > -1) {
          wx.reLaunch({
            url: targetUrl
          })
        } else {
          wx.redirectTo({
            url: targetUrl
          })
        }
      }
    });
  }
})