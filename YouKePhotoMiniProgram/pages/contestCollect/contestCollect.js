const app = getApp();
var util = require('../../utils/util.js');
var PageSize = 20;
Page({
  data: {
    total: 0,
    list: []
  },
  //跳转到作品详情页
  goDetails: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/activityDetails/activityDetails?aid=' + id
    })
  },
  //初始化数据
  onShow: function() {
    var that = this;
    that.setData({
      list: [],
      PageIndex: 1
    }, function() {
      that.getContestList(that.data.PageIndex, PageSize);
    });
  },
  //获取比赛收藏相关
  getContestList: function(PageIndex, PageSize, loadermore) {
    var that = this;
    var url = '/Activity/GetFavoriteActivityList';
    var requestData = {
      "PageModel": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      }
    };
    util.netRequest(url, requestData, function(data) {
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
  onReachBottom: function() {
    var that = this;
    if (that.data.list.length >= that.data.total) {
      console.log('数据加载完毕')
    } else {
      if (that.data.list.length > 0) {
        that.setData({
          PageIndex: that.data.PageIndex += 1,
        }, function() {
          that.getContestList(that.data.PageIndex, PageSize, true)
        })
      } else {
        console.log("底部了")
      }
    }
  },

})