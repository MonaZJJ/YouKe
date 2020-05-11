const app = getApp();
var util = require('../../utils/util.js');
var PageSize = 20;
Page({
  data: {
    wid: 0,
    systemUid: "",
    total: 0,
    List: [],
    //是否有评论按钮
    ifCommentBtn: {
      type: Boolean,
      value: false
    },
  },

  onLoad: function(options) {
    var that = this;
    that.setData({
      aid: options.aid,
      systemUid: wx.getStorageSync('uid')
    })
    console.log(that.data.aid, that.data.systemUid)
  },

  onShow: function() {
    var that = this;
    that.setData({
      List: [],
      PageIndex: 1
    }, function() {
      that.getWinnerList(that.data.PageIndex, PageSize);
    });
  },
  //未关注时调用添加关注接口
  show: function(e) {
    var that = this;
    var bigList = that.data.List;
    var uid = e.currentTarget.dataset.id;
    var url = '/UCenter/AddUserFollows';
    var requestData = {
      FollowUId: uid
    }
    util.netRequest(url, requestData, function(data) {
      if (data.Code == "100") {
        for (var i = 0; i < bigList.length; i++) {
          for (var j = 0; j < bigList[i].List.length; j++) {
            if (bigList[i].List[j].UId == uid) {
              bigList[i].List[j].IsFollow = true;
            }
          }
        }
        that.setData({
          List: bigList
        }, function () {
          wx.showToast({
            title: '关注成功',
            icon: 'success',
            duration: 1000
          })
        })
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
  noshow: function(e) {
    var that = this;
    var bigList = that.data.List;
    var uid = e.currentTarget.dataset.id;
    var url = '/UCenter/DeleteUserFollows';
    var requestData = {
      FollowUId: uid
    }
    util.netRequest(url, requestData, function(data) {
      if (data.Code == "100") {
        for (var i = 0; i < bigList.length; i++) {
          for (var j = 0; j < bigList[i].List.length; j++) {
            if (bigList[i].List[j].UId == uid) {
              bigList[i].List[j].IsFollow = false;
            }
          }
        }
        that.setData({
          List: bigList
        })
      } else {
        wx.showModal({
          title: '提示',
          content: data.Message,
          showCancel: false,
        })
      }
    });
  },

  //点赞按钮点击
  likesBtnClick: function(e) {
    var that = this;
    var wid = e.currentTarget.dataset.wid;
    var islike = e.currentTarget.dataset.like;
    if (islike) {
      that.cancelLikesClick(wid);
    } else {
      that.addLikesClick(wid);
    }
  },
  //添加点赞
  addLikesClick: function(wid) {
    var that = this;
    var bigList = that.data.List;
    var url = "/Works/LikeWorks";
    var requestData = {
      WorkId: wid
    };
    util.netRequest(url, requestData, function(data) {
      if (data.Code == 100) {
        for (var i = 0; i < bigList.length; i++) {
          for (var j = 0; j < bigList[i].List.length; j++) {
            if (bigList[i].List[j].WorkId == wid) {
              bigList[i].List[j].IsLike = true;
              bigList[i].List[j].LikeCount = bigList[i].List[j].LikeCount + 1;
            }
          }
        }
        that.setData({
          List:bigList
        },function(){
          wx.showToast({
            title: '谢谢您的点赞！',
            icon: 'success',
            duration: 1000
          })
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
  //取消点赞
  cancelLikesClick: function(wid) {
    var that = this;
    var bigList = that.data.List;
    var url = "/Works/UnLikeWorks";
    var requestData = {
      WorkId: wid
    };
    util.netRequest(url, requestData, function(data) {
      if (data.Code == 100) {
        for (var i = 0; i < bigList.length; i++) {
          for (var j = 0; j < bigList[i].List.length; j++) {
            if (bigList[i].List[j].WorkId == wid) {
              console.log(wid);
              console.log(bigList[i].List[j].WorkId)
              bigList[i].List[j].IsLike = false;
              bigList[i].List[j].LikeCount = bigList[i].List[j].LikeCount - 1;
            }
          }
        }
        that.setData({
          List: bigList
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

  //去个人主页
  goPersonPage: function(e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/personPage/personPage?uid=' + uid
    })
  },
  //去标签页
  goSignWorks: function(e) {
    var that = this;
    var tid = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '/pages/signWorks/signWorks?tid=' + tid,
    })
  },
  //去作品放大图
  goPreview: function (e) {
    var wid = e.currentTarget.dataset.wid;
    wx.navigateTo({
      url: '/pages/preview/preview?wid=' + wid + "&idx=" + 0
    })
  },

  //点击评论
  commentModalClcik: function(e) {
    var that = this;
    var wid = e.currentTarget.dataset.wid;
    wx.navigateTo({
      url: '/pages/worksDetail/worksDetail?wid=' + wid
    })
    // var commentModal = that.selectComponent('#commentModal');
    // that.setData({
    //   wid: wid
    // }, function() {
    //   commentModal.showModal();
    // })
  },

  // 组件刷新列表页面数据
  refreshListData: function(e) {
    var that = this;
    var leaveMsg = e.detail.leaveMsg;

    if (leaveMsg) {
      var wid = e.detail.wid;
      var bigList = that.data.List;
      for (var i = 0; i < bigList.length; i++) {
        for (var j = 0; j < bigList[i].List.length; j++) {
          if (bigList[i].List[j].WorkId == wid) {
            bigList[i].List[j].CommentCount = bigList[i].List[j].CommentCount + 1;
          }
        }
      }
      that.setData({
        List: bigList
      })
    }
  },

  // 获取获奖作品列表
  getWinnerList: function(PageIndex, PageSize, loadermore) {
    var that = this;
    var url = '/Works/GetWinnerActivityWorkList';
    var requestData = {
      "PageModel": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      },
      "AId": that.data.aid
    };
    util.netRequest(url, requestData, function(data) {
      if (data.Code == "100") {
        if (loadermore) {
          that.setData({
            List: that.data.List.concat(data.Data.List),
            total: data.Data.Total,
          })
        } else {
          that.setData({
            List: data.Data.List,
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
    var list = that.data.List;
    var finnalTotal = 0;
    for(var i = 0;i<list.length;i++){
      finnalTotal += list[i].List.length;
    }
    if (finnalTotal >= that.data.total) {
      console.log('数据加载完毕');
    } else {
      if (that.data.List.length > 0) {
        that.setData({
          PageIndex: that.data.PageIndex += 1,
        }, function () {
          that.getWinnerList(that.data.PageIndex, PageSize, true)
        })
      } else {
        console.log("底部了")
      }
    }
  },

})