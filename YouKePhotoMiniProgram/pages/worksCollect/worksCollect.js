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
    workList: [],   //作品列表
    total:0,  //总数
  },

  // 获取作品收藏列表数据
  getFavoriteWorkList: function (PageIndex, PageSize, loadermore) {
    var that = this;
    var url = "/Works/GetFavoriteWorkList";
    var requestData = {
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
    that.setData({
      PageIndex: 1,
      workList: []
    }, function () {
      that.getFavoriteWorkList(that.data.PageIndex, PageSize)
    });
  },

})