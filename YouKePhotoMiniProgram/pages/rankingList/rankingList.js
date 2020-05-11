// pages/rankingList/rankingList.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newDate: "",     //日期时间
    todayBoxList: [],    //今日数据
    bigBoxList: [],    //数据
    Rankingrules: "",    //规则说明
    lastPage: false,     //是否到底部了
  },
  //  问题按钮
  questionBtn() {
    var showModal = this.selectComponent("#showModal");
    showModal.showModal();
    this.getRankingrules();
  },
  //  获取规则
  getRankingrules: function () {
    var that = this;
    var url = "/Common/GetRankingrules";
    var requestData = {};
    util.netRequest(url, requestData, function (data) {
      that.setData({
        Rankingrules: data
      })
    })
  },

  // 去个人首页
  goPersonPage: function (e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/personPage/personPage?uid=' + uid
    })
  },

  //获取今日排行信息  格式：2019-01-30T09:34:55.193Z
  getTodayRanking: function () {
    var that = this;
    var url = "/Works/GetCurrentRanking";
    var requestData = {};
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        that.setData({
          todayBoxList: data.Data.List
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

  //获取排行信息  格式：2019-01-30T09:34:55.193Z
  getDayRanking: function (date, loadermore) {
    var that = this;
    var url = "/Works/GetDayRanking";
    var newDate = util.formatTime(date);
    var month = date.getMonth() + 1;
    var date = date.getDate();
    var dateText = month + "月" + date + "号";
    var requestData = {
      "Date": newDate
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        if (data.Data.List.length == 0) {
          that.setData({
            lastPage: true
          })
        } else {
          var boxItem = data.Data;
          boxItem.dateText = dateText;
          var bigBoxList = that.data.bigBoxList;
          if (loadermore) {
            bigBoxList.push(boxItem);
            that.setData({
              bigBoxList: bigBoxList
            })
          }
        }
      } else {
        wx.showModal({
          title: '提示',
          content: data.Message,
          showCancel: false
        })
      }
    })
  },

  //上拉刷新 加载更多
  onReachBottom: function () {
    var that = this;
    if (!that.data.lastPage) {
      var newDate = that.data.newDate;
      var date = new Date(newDate.setDate(newDate.getDate() - 1));
      that.setData({
        newDate: date
      }, function () {
        that.getDayRanking(date, true);
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var date = new Date();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var todayData = m + "月" + d + "日";
    that.setData({
      todayData: todayData,
      newDate: date,
      lastPage: false
    }, function () {
      that.getTodayRanking();
    })
  },

})