//个人主页
const app = getApp();
var util = require('../../utils/util.js');
//每页显示的记录数
var PageSize = 15;
Page({
  data: {
    uid: "", 
    winningList: [],
    total: 0,
  },
  //转到作品详情页
  goDetail: function (e) {
    var wid = e.currentTarget.dataset.wid;
    wx.navigateTo({
      url: '/pages/worksDetail/worksDetail?wid=' + wid
    })
  },
  //获取获奖作品列表
  getUserWinningList: function (PageIndex, PageSize, loadermore) {
    var that = this;
    var url = "/Works/GetUserWinnerWorkList";
    var requestData = {
      "UId": that.data.uid,
      "PageModel": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      }
    }
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        if (loadermore) {
          that.setData({
            winningList: that.data.winningList.concat(data.Data.List),
            total: data.Data.Total
          })
        } else {
          that.setData({
            winningList: data.Data.List,
            total: data.Data.Total
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
  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    var that = this;
    var uid = options.uid;
    that.setData({
      uid: uid, 
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      winningList: [],
      PageIndex: 1
    }, function () {
      that.getUserWinningList(that.data.PageIndex, PageSize);
    });
  },

  //上拉刷新 加载更多
  onReachBottom: function () {
    var that = this;
    if (that.data.winningList.length >= that.data.total) {
      console.log('数据加载完毕')
    } else {
      if (that.data.winningList.length > 0) {
        that.setData({
          PageIndex: that.data.PageIndex += 1,
        }, function () {
          that.getUserWinningList(that.data.PageIndex, PageSize, true)
        })
      } else {
        console.log("底部了")
      }
    }
  },
})