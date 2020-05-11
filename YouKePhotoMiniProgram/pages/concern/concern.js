const app = getApp();
var util = require('../../utils/util.js');
var PageSize = 20;
Page({
  data: {
    list: [],
    total: 0,
  },
  //去个人主页
  goPersonPage: function (e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/personPage/personPage?uid=' + uid
    })
  },
  //未关注时调用添加关注接口
  show: function (e) {
    var uid = e.currentTarget.dataset.uid;
    var that = this;
    var url = '/UCenter/AddUserFollows';
    var requestData = {
      FollowUId: uid
    }
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        that.setData({
          List: [],
          PageIndex: 1
        }, function () {
          that.getFollowsList(that.data.PageIndex, PageSize);
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
  //已关注时调用未关注接口
  noshow: function (e) {
    var that = this;
    var uid = e.currentTarget.dataset.uid;
    var url = '/UCenter/DeleteUserFollows';
    var requestData = {
      FollowUId: uid
    }
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        that.setData({
          List: [],
          PageIndex: 1
        }, function () {
          that.getFollowsList(that.data.PageIndex, PageSize);
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
      list: [],
      PageIndex: 1
    }, function() {
      that.getFollowsList(that.data.PageIndex, PageSize);
    });
  },
  // 获取关注用户列表
  getFollowsList: function(PageIndex, PageSize, loadermore) {
    var that = this;
    var url = '/UCenter/FollowsList';
    var requestData = {
      "Page": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      }
    };
    util.netRequest(url, requestData, function(data) {
      if (data.Code == "100") {
        if (loadermore) {
          that.setData({
            list: that.data.list.concat(data.Data.userfollowsList), 
            total: data.Data.Total,
          })
        } else {
          that.setData({
            list: data.Data.userfollowsList,
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
  onReachBottom: function() {
    var that = this;
    if (that.data.list.length >= that.data.total) {
      console.log('数据加载完毕')
    } else {
      if (that.data.list.length > 0) {
        that.setData({
          PageIndex: that.data.PageIndex += 1,
        }, function() {
          that.getFollowsList(that.data.PageIndex, PageSize, true)
        })
      } else {
        console.log("底部了")
      }
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      PageIndex: 1,
    }, function () {
      that.getFollowsList(that.data.PageIndex, PageSize);
      wx.stopPullDownRefresh(); // 停止下拉动作
    })
  },
})