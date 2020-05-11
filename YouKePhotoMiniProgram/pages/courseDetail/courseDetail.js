// pages/courseDetail/courseDetail.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var tencentVideo = require('../../utils/tencentVideo.js');
var PageSize = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tutorialInfo: "", // 教程信息
    tutorialList: [], //教程推荐列表
    total: "",
    tCommentList: [], //留言列表
    keyboardHeight: 0,
    message: '',
    tencentVideoUrl: ''
  },
  focusEvent: function(e) {
    console.log('键盘高度：', e.detail.height);
    this.setData({
      keyboardHeight: e.detail.height + 'px'
    })
  },
  blurEvent: function() {
    this.setData({
      keyboardHeight: 0
    })
  },
  inputMessageContent: function(e) {
    this.setData({
      message: e.detail.value
    })
  },
  inputConfirm: function() {
    var message = this.data.message;
    if (message == "" || message == null) {
      wx.showModal({
        title: '提示',
        content: "请输入评论内容",
        showCancel: false
      })
      return false;
    }
    this.addTutorialComment(message);
  },

  //教程详情
  getTutorialInfo: function() {
    var that = this;
    var url = "/Tutorial/TutorialInfo";
    var requestData = {
      TutorialId: that.data.tuid
    };
    util.netRequest(url, requestData, function(data) {
      if (data.Code == 100) {
        that.setData({
          tutorialInfo: data.Data
        }, function() {
          that.getTencentVideoUrl();
          that.getRecommendTutorialList();
          that.getTutorialCommentList(that.data.PageIndex, PageSize);
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
  //去教程详情
  toCourseDetail: function(e) {
    var tuid = e.currentTarget.dataset.tuid;
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?tuid=' + tuid,
    })
  },
  //获取教程视频推荐列表
  getRecommendTutorialList: function() {
    var that = this;
    var url = "/Tutorial/GetRecommendTutorialList";
    var requestData = {};
    util.netRequest(url, requestData, function(data) {
      if (data.Code == 100) {
        that.setData({
          tutorialList: data.Data.TutorialList
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
  // 获取留言列表
  getTutorialCommentList: function(PageIndex, PageSize, loadermore) {
    var that = this;
    var url = "/Tutorial/GetTutorialCommentList";
    var requestData = {
      "TId": that.data.tuid,
      "Page": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      }
    };
    util.netRequest(url, requestData, function(data) {
      if (data.Code == 100) {
        if (loadermore) {
          that.setData({
            tCommentList: that.data.tCommentList.concat(data.Data.List),
            tCommentTotal: data.Data.Total
          })
        } else {
          that.setData({
            tCommentList: data.Data.List,
            tCommentTotal: data.Data.Total,
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

  //收藏教程
  collectionCourses: function() {
    var that = this;
    var url = "/Tutorial/AddTutorialFavorite";
    var requestData = {
      "TutorialId": that.data.tuid
    };
    util.netRequest(url, requestData, function(data) {
      if (data.Code == 100) {
        var tuInfo = that.data.tutorialInfo;
        tuInfo.FavoriteJudge = true;
        that.setData({
          tutorialInfo: tuInfo
        })
        setTimeout(() => {
          wx.showToast({
            title: '收藏成功',
            icon: "success",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 1000)
        }, 0);
      } else {
        wx.showModal({
          title: '提示',
          content: data.Message,
          showCancel: false
        })
      }
    })
  },
  //取消收藏教程
  cancelCollectionCourses: function() {
    var that = this;
    var url = "/Tutorial/DeleteTutorialFavorite";
    var requestData = {
      "TId": that.data.tuid,
    };
    util.netRequest(url, requestData, function(data) {
      if (data.Code == 100) {
        var tuInfo = that.data.tutorialInfo;
        tuInfo.FavoriteJudge = false;
        that.setData({
          tutorialInfo: tuInfo
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

  //发表留言
  addTutorialComment: function(message) {
    var that = this;
    var tuid = that.data.tuid;
    var url = "/Tutorial/AddTutorialComment";
    var requestData = {
      "TId": tuid,
      "Content": message
    };
    console.log(requestData);
    util.netRequest(url, requestData, function(data) {
      if (data.Code == 100) {
        setTimeout(() => {
          wx.showToast({
            title: '留言成功',
            icon: "success",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 1000)
        }, 0);
        that.setData({
          keyboardHeight: 0,
          message: "",
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
    var tuid = options.tuid;
    that.setData({
      tuid: tuid,
      PageIndex: 1,
      tutorialList: [],
      tCommentList: [],
    }, function() {
      that.getTutorialInfo();
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  //上拉刷新 加载更多
  onReachBottom: function() {
    var that = this;
    if (that.data.tCommentList.length >= that.data.total) {
      console.log('数据加载完毕')
    } else {
      if (that.data.tCommentList.length > 0) {
        that.setData({
          PageIndex: that.data.PageIndex += 1,
        }, function() {
          that.getTutorialCommentList(that.data.PageIndex, PageSize, true)
        })
      } else {
        console.log("底部了")
      }
    }
  },

  //发送分享成功指令
  sendShareCodeMsg: function(code) {
    var that = this;
    var url = "/Tutorial/AddTutorialShares";
    var requestData = {
      "TutorialId": that.data.tuid
    };
    util.netRequest(url, requestData, function(data) {
      if (data.Code == 100) {
        console.log("教程详情转发成功");
      } else {
        wx.showModal({
          title: '提示',
          content: data.Message,
          showCancel: false
        })
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    // if (res.from === 'button') {}
    that.sendShareCodeMsg();
    return {
      title: that.data.tutorialInfo.Title,
      imageUrl: that.data.tutorialInfo.Cover,
      path: '/pages/courseDetail/courseDetail?tuid=' + that.data.tuid,
    }
  },
  //获取腾讯视频播放地址
  getTencentVideoUrl: function() {
    var that = this;
    //获取教程视频地址
    var videoUrl = that.data.tutorialInfo.Url;

    //返回值 response为返回的播放列表
    tencentVideo.getVideoes(videoUrl).then(function(response) {
      that.setData({
        tencentVideoUrl: response[0]
      });
    });
  }
})