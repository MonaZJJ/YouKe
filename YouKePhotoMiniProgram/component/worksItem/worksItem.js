// component/worksItem.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ifConcernBtn: {
      type: Boolean,
      value: false
    },
    workList: {
      type: Array,
      value: []
    },
    //一张图片时高度自适应 or 533rpx
    imgFirstWidthFix: {
      type: Boolean,
      value: false
    },
    //头像是否可跳转
    ifAvatarSrc: {
      type: Boolean,
      value: true
    },
    //是否有评论按钮
    ifCommentBtn: {
      type: Boolean,
      value: false
    },
    //是否有取消收藏按钮
    ifCancelCollectBtn: {
      type: Boolean,
      value: false
    },
    //是否有打分操作
    ifScoringArea: {
      type: Boolean,
      value: true
    },
    //是否显示获奖列表的获奖名称
    ifShowPrizeName: {
      type: Boolean,
      value: false
    },
    userUid:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    systemUid: wx.getStorageSync('uid'),
    screenWidth: app.globalData.screenWidth,
    score: 0, //打分
    rightWidth: 516,
    blockLeft: 0,
    showSlider: false, //打分弹窗
    slider: {
      backgroundColor: '#EBEBEB',
      blockColor: '#383838',
      size: 24
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goPhoneModel:function(e){ 
      var tid = e.currentTarget.dataset.tid;
      var pname = e.currentTarget.dataset.pname;
      wx.navigateTo({
        url: '/pages/phoneWorks/phoneWorks?tid=' + tid + "&pname=" + pname
      })
    }, //跳转到机型详情
    alyScoring:function(){  },    //已打分
    contentTap: function() {  },

    canvasIdErrorCallback(e) {
      console.error('canvasError:', e.detail.errMsg);
    },
    drawScoreChart: function(score) {
      var that = this;
      var ctx = wx.createCanvasContext('scoreCanvas',that);

      var scaleProp = that.data.screenWidth / 750;
      console.log('scaleProp:', scaleProp);
      ctx.translate(160 * scaleProp, 160 * scaleProp);

      // 绘制中间的圆
      ctx.save();
      ctx.lineWidth = 12 * scaleProp;

      ctx.beginPath();
      ctx.setLineCap('round');
      var grd = ctx.createLinearGradient(-160 * scaleProp, -160 * scaleProp, 160 * scaleProp, -160 * scaleProp);
      grd.addColorStop(0, '#6aaffd');
      grd.addColorStop(1, '#86f2fd');
      ctx.setStrokeStyle(grd);

      ctx.arc(0, 0, 144 * scaleProp, -0.5 * Math.PI, (2 * score / 100 - 0.5) * Math.PI);
      ctx.stroke();

      // 绘制文本
      ctx.beginPath();
      ctx.setFontSize(50);
      ctx.setFillStyle('#50aeff');
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');
      ctx.fillText(score, 0, 0);

      ctx.draw();
    },
    //点赞按钮点击
    likesBtnClick:function(e){
      var that = this;
      var wid = e.currentTarget.dataset.wid;
      var islike = e.currentTarget.dataset.like;
      if (islike){
        that.cancelLikesClick(wid);
      }else{
        that.addLikesClick(wid);
      }
    },
    //添加点赞
    addLikesClick: function (wid) {
      var that = this;
      var workList = that.data.workList;
      var url = "/Works/LikeWorks";
      var requestData = {
        WorkId:wid
      };
      util.netRequest(url, requestData, function (data) {
        if (data.Code == 100) { 
          for (var i = 0; i < workList.length; i++) {
            if (workList[i].WorkId == wid) {
              workList[i].IsLike  = true;
              workList[i].LikeCount = workList[i].LikeCount+1;
            }
          }
          setTimeout(() => {
            wx.showToast({
              title: '谢谢您的点赞!',
              icon: "success",
            });
            setTimeout(() => {
              wx.hideToast();
            }, 1000)
          }, 0);
          that.triggerEvent('refreshListData', { "workList": workList });                
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
    cancelLikesClick: function (wid) {
      var that = this;
      var workList = that.data.workList;
      var url = "/Works/UnLikeWorks";
      var requestData = {
        WorkId: wid
      };
      util.netRequest(url, requestData, function (data) {
        if (data.Code == 100) {
          for (var i = 0; i < workList.length; i++) {
            if (workList[i].WorkId == wid) {
              workList[i].IsLike = false;
              workList[i].LikeCount = workList[i].LikeCount -1;
            }
          }
          that.triggerEvent('refreshListData', { "workList": workList });
        } else {
          wx.showModal({
            title: '提示',
            content: data.Message,
            showCancel: false
          })
        }
      })
    },
    //关闭打分
    hideSliderLayer: function() {
      this.setData({
        score: 0,
        showSlider: false,
        rightWidth: 516,
        blockLeft: 0
      })
    },
    //改变打分的分数
    sliderChange: function(e) {
      var newScore = e.detail.value;
      console.log('slider:', newScore);
      this.setData({
        score: e.detail.value,
        rightWidth: Math.floor((100 - newScore) * 5.16),
        blockLeft: Math.floor(newScore * 5.16)
      })
      this.drawScoreChart(newScore);
    },
    // 我要打分
    showSliderLayer: function (e) {
      var that = this;
      var wid = e.currentTarget.dataset.wid;
      that.setData({
        showSlider: true,
        score: 0,
        wid: wid
      },function(){
        that.drawScoreChart(0);
      })
    },
    //确认打分
    scoreConfirm: function() {
      var that = this;
      var wid = that.data.wid;
      var score = that.data.score;
      var workList = that.data.workList;
      var url = "/Works/GradesWorks";
      var requestData = {
        WorkId: wid,
        Score: score
      };
      util.netRequest(url, requestData, function (data) {
        if (data.Code == 100) {
          for (var i = 0; i < workList.length; i++) {
            if (workList[i].WorkId == wid) {
              workList[i].AvgScore = data.Data;
              workList[i].GradesCount = workList[i].GradesCount + 1;
              workList[i].IsGrade = true;
            }
          }
          setTimeout(() => {
            wx.showToast({
              title: '打分成功',
              icon: "success",
            });
            setTimeout(() => {
              wx.hideToast();
            }, 1000)
          }, 0);    
          that.triggerEvent('refreshListData', { "workList": workList });   
        } else {
          wx.showModal({
            title: '提示',
            content: data.Message,
            showCancel: false
          })
        }
      })
      that.hideSliderLayer();
    },

    //去作品放大图
    goPreview: function(e) {
      var wid = e.currentTarget.dataset.wid;
      var idx = e.currentTarget.dataset.idx;
      wx.navigateTo({
        url: '/pages/preview/preview?wid=' + wid+"&idx="+idx
      })
    },
    //点击关注 IsFollow
    concernClick: function(e) {
      var that = this;
      var uid = e.currentTarget.dataset.uid;
      var workList = that.data.workList;
      var url = "/UCenter/AddUserFollows";
      var requestData = {
        FollowUId: uid
      };
      util.netRequest(url, requestData, function (data) {
        if (data.Code == 100) {
          for (var i = 0; i < workList.length; i++) {
            if (workList[i].UId == uid) {
              workList[i].IsFollow = true;
            }
          }
          setTimeout(() => {
            wx.showToast({
              title: '关注成功',
              icon: "success",
            });
            setTimeout(() => {
              wx.hideToast();
            }, 1000)
          }, 0);
          that.triggerEvent('refreshListData', { "workList": workList });
        } else {
          wx.showModal({
            title: '提示',
            content: data.Message,
            showCancel: false
          })
        }
      })
    }, 
    //取消关注 IsFollow
    // cancelConcernClick:function(e){
    //   var that = this;
    //   var uid = e.currentTarget.dataset.uid;
    //   var workList = that.data.workList;
    //   var url = "/UCenter/DeleteUserFollows";
    //   var requestData = {
    //     FollowUId: uid
    //   };
    //   util.netRequest(url, requestData, function (data) {
    //     if (data.Code == 100) {
    //       for (var i = 0; i < workList.length; i++) {
    //         if (workList[i].UId == uid) {
    //           workList[i].IsFollow = false;
    //         }
    //       }
    //       that.triggerEvent('refreshListData', { "workList": workList });
    //     } else {
    //       wx.showModal({
    //         title: '提示',
    //         content: data.Message,
    //         showCancel: false
    //       })
    //     }
    //   })
    // },
    //去个人主页
    goPersonPage: function(e) {
      var uid = e.currentTarget.dataset.uid;
      wx.navigateTo({
        url: '/pages/personPage/personPage?uid=' + uid
      })
    },
    //不跳转个人主页
    goPersonPageNo: function() {},
    //去标签页面
    goSignWorks: function(e) {
      var tid = e.currentTarget.dataset.tid;
      wx.navigateTo({
        url: '/pages/signWorks/signWorks?tid=' + tid
      })
      console.log("去标签页面id：" + tid);
    },
    //点击评论
    commentModalClcik: function(e) {
      var wid = e.currentTarget.dataset.wid;
      // this.triggerEvent('showCommentModal', {"wid":wid});
      wx.navigateTo({
        url: '/pages/worksDetail/worksDetail?wid=' + wid
      })
    },
    //取消收藏(作品收藏页面)
    cancelCollectClick: function(e) {
      var that = this;
      var wid = e.currentTarget.dataset.wid;
      console.log("点击取消收藏的作品id：" + wid);
    },
  }
})