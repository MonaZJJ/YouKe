//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var PageSize = 15;

Page({
  data: {
    PageIndex: 1,
    total: "", //列表总数

    ifHasHomeActInfo: false, //顶部比赛显示
    ifHasPathApp: false, //顶部跳转其他app显示

    RankingList: [], //今日排行
    workList: [], //作品列表（关注、推荐）
    tutorialList: [], // 教程列表
    tabIndex: 2,

    isFirstRequest:true,
  },
  // 跳转其他app
  goOtherApp:function(){
    var that = this;
    wx.navigateToMiniProgram({
      appId: that.data.AppId, // 要跳转的小程序的appid
      path: that.data.AppPath, // 跳转的目标页面
      extarData: that.data.ExtraData,
      success(res) {
        // 打开成功  
      }
    }) 
  },

  // 获取首页用户信息
  getHomeUserInfo: function (startloading) {
    var that = this;
    var url = "/UCenter/GetHomeUserInfo";
    var requestData = {};
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        that.setData({
          WelcomeSpeech: data.Data.WelcomeSpeech,
          LikeCount: data.Data.LikeCount,
          CommentCount: data.Data.CommentCount,
          HasMessage: data.Data.HasMessage
        },function(){
          that.getHomeMatchInfo(startloading);
          that.getRankingListInfo();
          if(that.data.HasMessage){
            wx.showTabBarRedDot({
              index: 2,
            })
          }else{
            wx.hideTabBarRedDot({
              index: 2,
            })
          }
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

  // 获取首页比赛信息
  getHomeMatchInfo: function (startloading) {
    var that = this;
    var url = "/Activity/GetHomeActivityInfo";
    var requestData = {};
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        if (data.Data.Type==1){
          if (data.Data.ActivityModelInfo != null && data.Data.ActivityModelInfo != "") {
            that.setData({
              homeActivityInfo: data.Data.ActivityModelInfo,
              ifHasHomeActInfo: true
            })
          }
        } else if (data.Data.Type == 2){
          that.setData({
            AppId: data.Data.AppId,
            AppPath: data.Data.AppPath,
            ExtraData: data.Data.ExtraData,
            BannerFullUrl: data.Data.BannerFullUrl,
            ifHasPathApp:true
          })
        }else{}
        if (startloading){
          that.getRecommendWorkList(that.data.PageIndex, PageSize); 
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
  // 获取今日排行
  getRankingListInfo: function () {
    var that = this;
    var url = "/Works/GetHomeRanking";
    var requestData = {};
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        that.setData({
          RankingList: data.Data.List
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
  // 组件刷新列表页面数据
  refreshListData: function (e) {
    var that = this;
    var leaveMsg = e.detail.leaveMsg;
    
    if (leaveMsg){
      var wid = e.detail.wid;
      var workList = that.data.workList;
      for (var i = 0; i < workList.length;i++){
        if (workList[i].WorkId == wid){
          workList[i].CommentCount = workList[i].CommentCount + 1;
        }
      }
      that.setData({
        workList: workList
      })
    }else{
      var newWorkList = e.detail.workList;
      that.setData({
        workList: newWorkList
      })
    }
  },
  // 获取关注作品列表数据
  getFollowWorkList: function (PageIndex, PageSize, loadermore) {
    var that = this;
    var url = "/Works/GetFollowWorkList";
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
  //获取推荐作品列表数据
  getRecommendWorkList: function (PageIndex, PageSize, loadermore) {
    var that = this;
    var url = "/Works/GetRecommendWorkList";
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
            total: data.Data.Total,
            userUid: wx.getStorageSync('uid')
          }, function () {
            that.addClassName();
          })
        } else {
          that.setData({
            workList: data.Data.List,
            total: data.Data.Total,
            userUid: wx.getStorageSync('uid')
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
  //教程列表
  getTutorialList: function (PageIndex, PageSize, loadermore) {
    var that = this;
    var url = "/Tutorial/GetTutorialList";
    var requestData = {
      "Page": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      }
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        if (loadermore) {
          that.setData({
            tutorialList: that.data.tutorialList.concat(data.Data.TutorialList),
            total: data.Data.Total
          })
        } else {
          that.setData({
            tutorialList: data.Data.TutorialList,
            total: data.Data.Total
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

  //去个人主页
  goPersonPage: function (e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/personPage/personPage?uid=' + uid
    })
  },
  //评论弹窗
  showcommentModalAction: function (e) {
    var that = this;
    var commentModal = that.selectComponent('#commentModal');
    that.setData({
      wid: e.detail.wid
    }, function () {
      commentModal.showModal();
    })
  },
  //返回顶部
  goTop: function () {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // 判断滚动条位置
  onPageScroll: function (e) {
    if (e.scrollTop > 700) {
      this.setData({
        backTopShow: true
      })
    } else {
      this.setData({
        backTopShow: false
      })
    }
  },
  //去教程详情
  toCourseDetail: function (e) {
    var tuid = e.currentTarget.dataset.tuid;
    wx.navigateTo({
      url: '../courseDetail/courseDetail?tuid=' + tuid,
    })
  },
  previewWorkImg: function () {
    wx.navigateTo({
      url: '../preview/preview',
    })
  },
  //关注、推荐、教程切换
  changeTab: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    if (index != this.data.tabIndex) {
      that.setData({
        tabIndex: index,
        PageIndex: 1,
        workList: [],
        tutorialList: [],
        total: ""
      })
      if (index == 1) {
        that.getFollowWorkList(that.data.PageIndex, PageSize)
      } else if (index == 2) {
        that.getRecommendWorkList(that.data.PageIndex, PageSize)
      } else {
        that.getTutorialList(that.data.PageIndex, PageSize)
      }
    }
  },


  //上拉刷新 加载更多
  onReachBottom: function () {
    var that = this;
    var tabIndex = that.data.tabIndex;
    if (tabIndex == 1) {
      if (that.data.workList.length >= that.data.total) {
        console.log('数据加载完毕')
      } else {
        if (that.data.workList.length > 0) {
          that.setData({
            PageIndex: that.data.PageIndex += 1,
          }, function () {
            that.getFollowWorkList(that.data.PageIndex, PageSize, true)
          })
        } else {
          console.log("底部了")
        }
      }
    } else if (tabIndex == 2) {
      if (that.data.workList.length >= that.data.total) {
        console.log('数据加载完毕')
      } else {
        if (that.data.workList.length > 0) {
          that.setData({
            PageIndex: that.data.PageIndex += 1,
          }, function () {
            that.getRecommendWorkList(that.data.PageIndex, PageSize, true)
          })
        } else {
          console.log("底部了")
        }
      }
    } else {
      if (that.data.tutorialList.length >= that.data.total) {
        console.log('数据加载完毕')
      } else {
        if (that.data.tutorialList.length > 0) {
          that.setData({
            PageIndex: that.data.PageIndex += 1,
          }, function () {
            that.getTutorialList(that.data.PageIndex, PageSize, true)
          })
        } else {
          console.log("底部了")
        }
      }
    }
  },

  onLoad: function () {
    var that = this;
    that.setData({
      PageIndex: 1,
      workList: [],
      tabIndex: 2,
    }, function () {
      that.getHomeUserInfo(true);
    });
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
    if(!that.data.isFirstRequest){
      that.getHomeUserInfo(false);
      that.listDataUpdating(that.data.PageIndex, PageSize);
    }
    that.setData({
      isFirstRequest:false
    })
  },

  //数据更新，不刷新图片
  listDataUpdating: function (PageIndex, PageSize){
    var that = this;
    var tabindex = that.data.tabIndex;
    var newPageSize = PageIndex * PageSize;
    var total = that.data.total;
    var workList = that.data.workList;
    var tutorialList = that.data.tutorialList;
    if (tabindex == 1){
      var url = "/Works/GetFollowWorkList";
    } else if (tabindex == 2){
      var url = "/Works/GetRecommendWorkList";
    }else{
      var url = "/Tutorial/GetTutorialList";
    }
    var requestData = {
      "PageModel": {
        "PageIndex": 1,
        "PageSize": newPageSize
      }
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        if (tabindex == 3) {     //教程 tutorialList
          var newTutorialList = data.Data.TutorialList;
          if (total == data.Data.Total){
            for (var i in tutorialList) {
              if (tutorialList[i].TutorialId == newTutorialList[i].TutorialId) {
                tutorialList[i].BrowsesCount = newTutorialList[i].BrowsesCount;
              }
            }
          }else{
            tutorialList = newTutorialList;
            total = data.Data.Total;
          }
          that.setData({
            tutorialList: tutorialList,
            total: total
          })
        } else {    // 关注、推荐 workList
          var newWorkList = data.Data.List;
          if (total == data.Data.Total) {
            for (var i in workList) {
              if (workList[i].WorkId == newWorkList[i].WorkId) {
                workList[i].IsFollow = newWorkList[i].IsFollow;
                workList[i].IsGrade = newWorkList[i].IsGrade;
                workList[i].IsLike = newWorkList[i].IsLike;
                workList[i].LikeCount = newWorkList[i].LikeCount;
                workList[i].AvgScore = newWorkList[i].AvgScore;
                workList[i].GradesCount = newWorkList[i].GradesCount;
                workList[i].CommentCount = newWorkList[i].CommentCount;
                workList[i].Authentication = newWorkList[i].Authentication;
              }
            }
            that.setData({
              workList: workList,
              total: total
            })
          }else{
            workList = newWorkList;
            total = data.Data.Total;
            that.setData({
              workList: workList,
              total: total
            },function(){
              that.addClassName();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 下拉刷新
  onPullDownRefresh: function () {
    // wx.showNavigationBarLoading();      // 显示顶部刷新图标
    var that = this;
    var index = that.data.tabIndex;
    that.setData({
      PageIndex: 1,
    }, function () {
      that.getHomeUserInfo();
      if (index == 1) {
        that.getFollowWorkList(that.data.PageIndex, PageSize)
      } else if (index == 2) {
        that.getRecommendWorkList(that.data.PageIndex, PageSize)
      } else {
        that.getTutorialList(that.data.PageIndex, PageSize)
      }
      wx.stopPullDownRefresh();   // 停止下拉动作
    })
    // wx.hideNavigationBarLoading();  // 隐藏导航栏加载框
  },

})