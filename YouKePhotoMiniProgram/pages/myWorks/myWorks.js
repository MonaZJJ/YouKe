//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var PageSize = 15;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    PageIndex: 1,
    uid: 0,        //我的id
    workList: [],   //作品列表
    total: 0,  //总数
  },

  // 获取作品列表数据
  getUserWorkList: function (PageIndex, PageSize, loadermore) {
    var that = this;
    var url = "/Works/GetUserWorkList";
    var requestData = {
      "UId": that.data.uid,
      "PageModel": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      }
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        if (loadermore) {
          that.setData({
            workList: that.data.workList.concat(data.Data.List),
            total: data.Data.Total
          }, function () {
            that.addClassName();
          })
        } else {
          that.setData({
            workList: data.Data.List,
            total: data.Data.Total
          }, function () {
            that.addClassName();
          })
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

  // 组件刷新列表页面数据
  refreshListData: function (e) {
    var that = this;
    // var leaveMsg = e.detail.leaveMsg;

    // if (leaveMsg) {
    //   var wid = e.detail.wid;
    //   var workList = that.data.workList;
    //   for (var i = 0; i < workList.length; i++) {
    //     if (workList[i].WorkId == wid) {
    //       workList[i].CommentCount = workList[i].CommentCount + 1;
    //     }
    //   }
    //   that.setData({
    //     workList: workList
    //   })
    // } else {
      var newWorkList = e.detail.workList;
      that.setData({
        workList: newWorkList
      })
    // }
  },

  //上拉刷新 加载更多
  onReachBottom: function () {
    var that = this;
    var tabIndex = that.data.tabIndex;
    if (that.data.workList.length >= that.data.total) {
      console.log('数据加载完毕')
    } else {
      if (that.data.workList.length > 0) {
        that.setData({
          PageIndex: that.data.PageIndex += 1,
        }, function () {
          that.getUserWorkList(that.data.PageIndex, PageSize, true)
        })
      } else {
        console.log("底部了")
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var uid = wx.getStorageSync("uid");
    // this.setData({
    //   uid: uid
    // })
  },

  //为图片集添加className字段
  addClassName: function () {
    var that = this;
    var workListNew = that.data.workList;
    for (var i = 0; i < workListNew.length; i++) {
      workListNew[i].className = 'item-' + workListNew[i].ImgList.length;
    }
    that.setData({
      workList: workListNew
    })
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
    that.setData({
      PageIndex: 1,
      workList: [],
      total:0
    }, function () {
      that.getUserWorkList(that.data.PageIndex, PageSize)
    });
  },

})