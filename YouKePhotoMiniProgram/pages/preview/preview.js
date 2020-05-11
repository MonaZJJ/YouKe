// pages/preview/preview.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    imgList: [],
    state: 1,
    current: 0,

    //图片的信息
    imgInfo:"",    
  },
  closePreview: function() {
    wx.navigateBack({
    })
  },
  hideParameterBox: function() {
    this.setData({
      state: 1
    })
  },
  showParameterBox: function() {
    var that = this;
    var current = that.data.current;
    var imgList = that.data.imgList;
    that.setData({
      state:2,
      imgInfo: imgList[current]
    })
  },
  changSwiperCurrent: function(e) {
    var that = this;
    var current = e.detail.current;
    var imgList = that.data.imgList;
    that.setData({
      current: current,
      imgInfo: imgList[current]
    })
  },

  // 获取图片详情
  getImageExifInfo:function(){
    var that = this;
    var wid = that.data.wid;
    var url = "/Works/GetImageExifInfo";
    var requestData = {
      WId: wid
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        that.setData({
          imgList: data.Data.List,
          NickName: data.Data.NickName,
          Avatar: data.Data.Avatar,
          Desc: data.Data.Desc,
          Title: data.Data.Title,
          UId: data.Data.UId
        })
      } else {
        wx.showModal({
          title: '提示',
          content: data.Message,
          showCancel: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var wid = options.wid;
    var idx = parseInt(options.idx);
    if (idx!=null||idx!=undefined){
      that.setData({
        wid: wid,
        current: idx
      })
    }else{
      that.setData({
        wid: wid,
        current: 0
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getImageExifInfo();
  },

})