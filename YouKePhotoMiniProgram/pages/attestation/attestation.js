const app = getApp();
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {

  },
  // 申请
  applyClick: function(e) {
    wx.redirectTo({
      url: '/pages/attestationNext/attestationNext'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getNotice: function() {
    var that = this;
    var url = '/Common/GetAuthenNotice';
    var requestData = {};
    util.netRequest(url, requestData, function(data) {
      that.setData({}, function() {
        WxParse.wxParse('attestation', 'html', data, that, 0);
      })
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.getNotice();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})