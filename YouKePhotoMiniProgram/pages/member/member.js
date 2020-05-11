const app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    uid: 0,
    avatar: "",
    userInfo: "",
    phone: "",
    email: ""
  },
  onLoad: function() {

  },
  //初始化数据
  onShow: function() {
    this.getUserInfo();
  },

  // 获取用户信息
  getUserInfo: function() {
    var that = this;
    var url = '/UCenter/UOwnCenterData';
    var requestData = {};
    util.netRequest(url, requestData, function(data) {
      if (data.Code == "100") {
        that.setData({
          userInfo: data.Data,
          avatar: data.Data.Avatar,
        },function(){
          that.getPhoneEmail();
          if (that.data.userInfo.HasMessage) {
            wx.showTabBarRedDot({
              index: 2,
            })
          } else {
            wx.hideTabBarRedDot({
              index: 2,
            })
          }
        });
      } else {
        wx.showModal({
          title: '提示',
          content: data.Message,
          showCancel: false,
        })
      }
    });
  },
  //联系我们点击
  contact: function() {
    var that = this;
    var showModal = that.selectComponent("#showModal");
    showModal.showModal();
  },
  getPhoneEmail: function() {
    var that = this;
    var url = "/Common/GetPhoneEmail";
    var requestData = {};
    util.netRequest(url, requestData, function(data) {
      that.setData({
        phone: data.phone,
        email: data.email
      })
    })
  },

  callPhone: function() {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.phone
    })
  },
  //下拉刷新
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      PageIndex: 1,
    }, function() {
      that.getUserInfo();
      that.getPhoneEmail();
      wx.stopPullDownRefresh(); // 停止下拉动作
    })
  },

})