var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    avatar: "",
    userInfo: {}
  },
  // 获取用户信息
  getUserInfo: function() {
    var that = this;
    var url = '/UCenter/UCenterData';
    var requestData = {};
    util.netRequest(url, requestData, function(data) {
      if (data.Code == "100") {
        that.setData({
          userInfo: data.Data,
          avatar: data.Data.Avatar,
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
  //初始化数据
  onShow: function() {
    var that = this;
    that.setData({

    }, function() {
      that.getUserInfo();
    })
  },
  //提交表单数据
  editUser: function(e) {
    var that = this;
    var formData = e.detail.value; //获取表单所有input的值
    if (formData.NickName == "") {
      wx.showModal({
        title: '提示',
        content: "昵称不能为空",
        showCancel: false,
      })
      return false;
    }
    var url = '/UCenter/EditUser';
    var requestData = {
      "NickName": formData.NickName,
      "Introduce": formData.Introduce
    };
    util.netRequest(url, requestData, function(data) {
      if (data.Code == "100") {
        wx.switchTab({
          url: '/pages/member/member',
        })
      } else {
        wx.showModal({
          title: '提示',
          content: data.Message,
          showCancel: false,
        })
      }
    });
  }
})