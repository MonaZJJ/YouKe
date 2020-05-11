const app = getApp();
var util = require('../../utils/util.js');
var PageSize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEnd: 0,
    type: 0, //0:进行中 1:已结束
    total: 0,
    list: [],

  },
  //tab切换
  selected: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    that.setData({
      isEnd: type,
      type: type,
      list: [],
      PageIndex: 1
    }, function () {
      that.getActivityList(that.data.PageIndex, PageSize);
    });
  },

  //参加、查看作品 - 跳转活动详情页面
  goActivityDetails: function (e) {
    var that = this;
    var aid = e.currentTarget.dataset.aid;
    wx.navigateTo({
      url: '/pages/activityDetails/activityDetails?aid=' + aid
    })
  },

  //查看作品-跳转活动详情页面2
  // concept: function(e) {
  //   var that = this;
  //   var aid = e.currentTarget.dataset.aid;
  //   wx.navigateTo({
  //     url: '/pages/activityDetailsEnd/activityDetailsEnd?aid=' + aid
  //   })
  //   console.log("查看作品id=" + aid);
  // },

  //初始化数据
  onShow: function () {
    var that = this;
    that.setData({
      list: [],
      PageIndex: 1
    }, function () {
      that.getActivityList(that.data.PageIndex, PageSize);
    });
  },

  // 获取比赛列表
  getActivityList: function (PageIndex, PageSize, loadermore) {
    var that = this;
    var url = '/Activity/GetActivityList';
    var requestData = {
      "IsEnd": that.data.isEnd,
      "PageModel": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      }
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        if (loadermore) {
          that.setData({
            list: that.data.list.concat(data.Data.List),
            total: data.Data.Total,
          })
        } else {
          that.setData({
            list: data.Data.List,
            total: data.Data.Total,
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          content: data.Message,
          showCancel: false,
        })
      }
    });
  },

  //上拉刷新 加载更多
  onReachBottom: function () {
    var that = this;
    if (that.data.list.length >= that.data.total) {
      console.log('数据加载完毕')
    } else {
      if (that.data.list.length > 0) {
        that.setData({
          PageIndex: that.data.PageIndex += 1,
        }, function () {
          that.getActivityList(that.data.PageIndex, PageSize, true)
        })
      } else {
        console.log("底部了")
      }
    }
  },

  // 添加活动分享
  addActivityShares: function (aid) {
    var that = this;
    var url = '/Activity/AddActivityShares';
    var requestData = {
      "AId": aid
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        console.log("活动转发成功");
      } else {
        wx.showModal({
          title: '提示',
          content: data.Message,
          showCancel: false,
        })
      }
    });
  },

  /**
   * 分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    var aid = res.target.dataset.aid;
    that.addActivityShares(aid);
    if (res.from === 'button') {
      return {
        title: res.target.dataset.title,
        imageUrl: res.target.dataset.url,
        path: '/pages/activityDetails/activityDetails?aid=' + aid,
      }
    }
  }

})