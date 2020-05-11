// pages/personDetail/personDetail.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var PageSize = 15;

Page({

  data: {
    PageIndex: 1,
    workInfo: "",  //作品详情
    imgList: [],  //作品图片列表
    IsFollow: true,  //是否关注
    IsLike: false,  //是否点赞
    IsAuthor: false,  //是否为作者本人
    IsFavorite: false,  //是否收藏
    QrCodeUrl: "",  //二维码
    IsGrades: false,  //打分状态

    poster: "",
    qrcodeUrl: "",

    screenWidth: app.globalData.screenWidth, //屏幕宽度
    score: 0, //打分
    rightWidth: 516,
    blockLeft: 0,
    showSlider: false, //打分弹窗
    slider: {
      backgroundColor: '#EBEBEB',
      blockColor: '#383838',
      size: 24
    },

    tabIndex: 1,    //1:用户留言 2:点赞
    keyboardHeight: 0,
    message: '',

    maskflag: false, //遮罩层
    showShareImg: false, //显示海报

    msgTotal: 0,  //留言总数
    tCommentList: [],
    likeTotal: 0, //点赞总数
    workLikeList: [],

  },

  // 打分绘制
  drawScoreChart: function (score) {
    var that = this;
    var ctx = wx.createCanvasContext('scoreCanvas', that);
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
  //关闭打分
  hideSliderLayer: function () {
    this.setData({
      score: 0,
      showSlider: false,
      rightWidth: 516,
      blockLeft: 0
    })
  },
  contentTap: function () { },
  canvasIdErrorCallback(e) {
    console.error('canvasError:', e.detail.errMsg);
  },
  //改变打分的分数
  sliderChange: function (e) {
    var newScore = e.detail.value;
    console.log('slider:', newScore);
    this.setData({
      score: e.detail.value,
      rightWidth: Math.floor((100 - newScore) * 5.16),
      blockLeft: Math.floor(newScore * 5.16)
    })
    this.drawScoreChart(newScore);
  },
  //确认打分
  scoreConfirm: function () {
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
        setTimeout(() => {
          wx.showToast({
            title: '打分成功',
            icon: "success",
          });
          setTimeout(() => {
            wx.hideToast();
            that.getWorkInfo();
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
    that.hideSliderLayer();
  },
  showSliderLayer: function () {
    var that = this;
    that.setData({
      showSlider: true,
      score: 0,
      // wid: wid
    }, function () {
      that.drawScoreChart(0);
    })
  },
  hideSliderLayer: function () {
    this.setData({
      showSlider: false,
      rightWidth: 516,
      blockLeft: 0
    })
  },

  //获取作品详情 
  getWorkInfo: function () {
    var that = this;
    var url = "/Works/GetWorkInfo";
    var requestData = {
      "WorkId": that.data.wid
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        that.setData({
          workInfo: data.Data.WorkInfo,
          imgList: data.Data.WorkInfo.ImgList,
          IsFollow: data.Data.IsFollow,
          IsLike: data.Data.IsLike,
          IsAuthor: data.Data.IsAuthor,
          IsFavorite: data.Data.IsFavorite,
          QrCodeUrl: data.Data.QrCodeUrl,
          IsGrades: data.Data.IsGrades,
          PageIndex: 1,
        }, function () {
          that.addClassName();
          that.getWorkCommentList(that.data.PageIndex, PageSize);
          that.getWorkLikeList(that.data.PageIndex, PageSize);
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
  //为图片集添加className字段
  addClassName: function () {
    var that = this;
    var workInfoNew = that.data.workInfo;
    workInfoNew.className = 'item-' + workInfoNew.ImgList.length;
    that.setData({
      workInfo: workInfoNew
    })
  },
  //关注
  addfollowClick: function () {
    var that = this;
    var url = "/UCenter/AddUserFollows";
    var requestData = {
      "FollowUId": that.data.workInfo.UId
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        setTimeout(() => {
          wx.showToast({
            title: '关注成功',
            icon: "success",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 1000)
        }, 0);
        that.setData({
          IsFollow: true
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
  //获取用户留言列表
  getWorkCommentList: function (PageIndex, PageSize, loadermore) {
    var that = this;
    var url = "/Works/GetWorkCommentList";
    var requestData = {
      "WorkId": that.data.wid,
      "PageModel": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      }
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        if (loadermore) {
          that.setData({
            tCommentList: that.data.tCommentList.concat(data.Data.List),
            msgTotal: data.Data.Total
          }, function () {
            that.addIsShowReply();
          })
        } else {
          that.setData({
            tCommentList: data.Data.List,
            msgTotal: data.Data.Total,
          }, function () {
            that.addIsShowReply();
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
  //为留言列表添加isShowReply字段
  addIsShowReply: function () {
    var that = this;
    var list = that.data.tCommentList;
    var uid = that.data.workInfo.UId;
    if (that.data.IsAuthor) {
      if (list.length != 0) {
        for (var i = 0; i < list.length; i++) {
          if (uid == list[i].UId) {
            list[i].isShowReply = false
          } else {
            list[i].isShowReply = true
          }
        }
      }
    }
    that.setData({
      tCommentList: list
    })
  },
  //留言回复 
  comReplyClick: function (e) {
    var uid = e.currentTarget.dataset.uid;
    this.setData({
      replyUId: uid
    })
    var commentModal = this.selectComponent('#commentModal');
    commentModal.showModal();
  },
  //作者回复确认
  refreshListData: function () {
    var that = this;
    that.setData({
      PageIndex: 1,
      tCommentList: []
    }, function () {
      that.getWorkCommentList(that.data.PageIndex, PageSize);
    })
  },

  //获取点赞列表
  getWorkLikeList: function (PageIndex, PageSize, loadermore) {
    var that = this;
    var url = "/Works/GetWorkLikeInfo";
    var requestData = {
      "WorkId": that.data.wid,
      "PageModel": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      }
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        if (loadermore) {
          that.setData({
            workLikeList: that.data.workLikeList.concat(data.Data.List),
            likeTotal: data.Data.Total
          })
        } else {
          that.setData({
            workLikeList: data.Data.List,
            likeTotal: data.Data.Total,
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

  changeTab: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    if (index != this.data.tabIndex) {
      that.setData({
        tabIndex: index,
        PageIndex: 1,
        // msgTotal: 0,
        tCommentList: [],
        // likeTotal: 0,
        workLikeList: [],
      }, function () {
        if (index == 1) {
          that.getWorkCommentList(that.data.PageIndex, PageSize);
        } else {
          that.getWorkLikeList(that.data.PageIndex, PageSize);
        }
      })
    }
  },

  // 点赞
  likeWorksClick: function () {
    var that = this;
    var isLike = that.data.IsLike;
    if (isLike) {
      var url = "/Works/UnLikeWorks";
    } else {
      var url = "/Works/LikeWorks";
    }
    var requestData = {
      WorkId: that.data.workInfo.WorkId
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        if (!isLike) {
          setTimeout(() => {
            wx.showToast({
              title: '谢谢您的点赞！',
              icon: "success",
            });
            setTimeout(() => {
              wx.hideToast();
              if (that.data.tabIndex == 1) {
                that.getWorkLikeList(1, PageSize);
              } else {
                that.setData({
                  PageIndex: 1
                }, function () {
                  that.getWorkLikeList(that.data.PageIndex, PageSize);
                })
              }
            }, 1000)
          }, 0);
          that.setData({
            IsLike: true
          })
        } else {
          that.setData({
            IsLike: false
          })
          if (that.data.tabIndex == 1) {
            that.getWorkLikeList(1, PageSize);
          } else {
            that.setData({
              PageIndex: 1
            }, function () {
              that.getWorkLikeList(that.data.PageIndex, PageSize);
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
  // 收藏
  favoriteWorksClick: function () {
    var that = this;
    var isFavorite = that.data.IsFavorite;
    if (isFavorite) {
      var url = "/Works/UnFavoriteWorks";
    } else {
      var url = "/Works/FavoriteWorks";
    }
    var requestData = {
      WorkId: that.data.workInfo.WorkId
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        if (!isFavorite) {
          setTimeout(() => {
            wx.showToast({
              title: '收藏成功',
              icon: "success",
            });
            setTimeout(() => {
              wx.hideToast();
            }, 1000)
          }, 0);
          that.setData({
            IsFavorite: true
          })
        } else {
          that.setData({
            IsFavorite: false
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

  //去标签页面
  goSignWorks: function (e) {
    var tid = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '/pages/signWorks/signWorks?tid=' + tid
    })
  },
  //去作品放大图
  goPreview: function (e) {
    var idx = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '/pages/preview/preview?wid=' + this.data.wid + "&idx=" + idx
    })
  },

  focusEvent: function (e) {
    this.setData({
      keyboardHeight: e.detail.height + 'px'
    })
  },
  blurEvent: function () {
    this.setData({
      keyboardHeight: 0
    })
  },
  inputMessageContent: function (e) {
    this.setData({
      message: e.detail.value
    })
  },
  //写留言确认
  inputConfirm: function (e) {
    var that = this;
    var url = "/Works/LeaveMessageForWork";
    var requestData = {
      "WId": that.data.wid,
      "UId": 0,
      "Content": that.data.message
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        setTimeout(() => {
          wx.showToast({
            title: '留言成功',
            icon: "success",
          });
          setTimeout(() => {
            wx.hideToast();
            that.setData({
              tabIndex: 1,
              tCommentList: [],
              message: "",
              PageIndex: 1
            }, function () {
              that.getWorkCommentList(that.data.PageIndex, PageSize);
            })
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
  //生成分享卡
  posterShare: function (e) {
    var that = this;
    var simpleImgUrl = that.data.imgList[0].SimpleImgUrl;
    that.setData({
      maskflag: true,
      showShareImg: true
    }, function () {
      //获取网络图片本地路径
      wx.getImageInfo({
        src: simpleImgUrl, //服务器返回的图片地址
        success: function (res) {
          that.setData({
            poster: res.path
          }, () => {
            //获取网络图片本地路径
            wx.getImageInfo({
              src: that.data.QrCodeUrl,
              success: function (res) {
                that.setData({
                  qrcodeUrl: res.path
                }, () => {
                  that.sharePosteCanvas();
                })
              },
              fail: function (res) {
                that.sharePosteCanvas();
              }
            });
          });
        },
        fail: function (res) {
          that.sharePosteCanvas();
        }
      });
    });
  },
  // 保存分享卡
  posterSave: function (e) {
    var that = this;
    that.setData({}, function () {
      that.saveShareImg();
    });
  },
  // 关闭海报
  closeMask: function (e) {
    var that = this;
    that.setData({
      maskflag: false,
      showShareImg: false
    });
  },
  // 绘制分享卡
  sharePosteCanvas: function () {
    wx.showLoading({
      title: '图片生成中...',
      mask: true,
    })
    var that = this;
    var posterInfo = that.data.workInfo;
    const ctx = wx.createCanvasContext('posterCanvas');
    wx.createSelectorQuery().select('#posterCanvas').boundingClientRect(function (res) {
      var height = res.height;
      var width = res.width;
      var r = 2; // 圆角
      ctx.setFillStyle('#fff');
      // 左上角
      ctx.arc(r, r, r, Math.PI, Math.PI * 1.5);
      // border-top
      ctx.moveTo(r, 0);
      ctx.lineTo(width - r, 0);
      ctx.lineTo(width, r);
      // 右上角
      ctx.arc(width - r, r, r, Math.PI * 1.5, Math.PI * 2);
      // border-right
      ctx.lineTo(width, height - r);
      ctx.lineTo(width - r, height);
      // 右下角
      ctx.arc(width - r, height - r, r, 0, Math.PI * 0.5);
      // border-bottom
      ctx.lineTo(r, height);
      ctx.lineTo(0, height - r);
      // 左下角
      ctx.arc(r, height - r, r, Math.PI * 0.5, Math.PI);
      // border-left
      ctx.lineTo(0, r);
      ctx.lineTo(r, 0);
      ctx.clip();

      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, width, height);
      ctx.save();

      //海报背景
      var url = that.data.imgList[0].SimpleImgUrl;
      if (url) {
        ctx.drawImage(that.data.poster, 0, 0, width, height * 0.75);
      }

      //海报名字
      if (posterInfo.Title.length > 0) {
        ctx.setFillStyle('#383838');
        ctx.setFontSize(width * 0.045);
        if (posterInfo.Title.length > 12) {
          var posterName = that.data.workInfo.Title
          posterName = posterName.substring(0, 12) + "...";
          ctx.fillText(posterName, width * 0.035, height * 0.8) //绘制文本
        } else {
          ctx.fillText(posterInfo.Title, width * 0.035, height * 0.8) //绘制文本
        }
      }
      //个性签名Desc
      if (posterInfo.Desc.length > 0) {
        ctx.setFillStyle('#8A8A8A');
        ctx.setFontSize(width * 0.035);
        if (posterInfo.Desc.length > 18) {
          var posterMotto = that.data.workInfo.Desc;
          posterMotto = posterMotto.substring(0, 18) + "...";
          ctx.fillText(posterMotto, width * 0.035, height * 0.85); //绘制文本
        } else {
          ctx.fillText(posterInfo.Desc, width * 0.035, height * 0.85); //绘制文本
        }
      }
      //绘制一条线
      ctx.setFillStyle("#000000");
      ctx.moveTo(width * 0.036, height * 0.94);
      ctx.lineTo(width * 0.2, height * 0.94);
      ctx.setLineWidth(0.2);
      ctx.stroke();
      //海报描述NickName
      if (posterInfo.NickName) {
        ctx.setFillStyle('#000000');
        ctx.setFontSize(width * 0.03);
        if (posterInfo.NickName.length > 20) {
          var posterMotto = that.data.workInfo.NickName;
          posterMotto = posterMotto.substring(0, 20) + "...";
          ctx.fillText(posterMotto, width * 0.035, height * 0.97); //绘制文本
        } else {
          ctx.fillText(posterInfo.NickName, width * 0.035, height * 0.97); //绘制文本
        }
      }
      // 绘制二维码
      if (that.data.QrCodeUrl) {
        ctx.drawImage(that.data.qrcodeUrl, width * 0.69, height * 0.785, width * 0.25, height * 0.18);
      }
    }).exec()
    //生成图片设置的时间
    setTimeout(function () {
      ctx.draw();
      wx.hideLoading();
    }, 1000)
  },
  //点击保存到相册
  saveShareImg: function () {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function () {
      wx.canvasToTempFilePath({
        quality: 1,
        fileType: 'png',
        canvasId: 'posterCanvas',
        success: function (res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function (res) {
              //将图片保存到本地
              wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success: function (res) {
                  wx.showToast({
                    title: '已下载到手机相册',
                    icon: "none",
                    duration: 1000
                  })
                },
                fail: function (res) {
                  wx.showToast({
                    title: '下载失败，请直接截屏',
                    icon: "none",
                    duration: 1000
                  });
                }
              });
            },
            fail: function (res) {
              wx.showModal({
                title: '提示',
                content: '同意微信授权用户信息',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {

                      }
                    })
                  }
                }
              });
            }
          })

        }
      });
    }, 1000);
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (!options.scene){
      that.setData({
        wid: options.wid
      })
    }else{
      //二维码进入
      that.setData({
        wid: options.scene
      })
    }
    that.setData({
      score: 0, //打分
      rightWidth: 516,
      blockLeft: 0,
      tabIndex: 1,    //1:用户留言 2:点赞
      keyboardHeight: 0,
      message: '',
    }, function () {
      that.getWorkInfo();
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  
  // 点赞展开更多
  openMoreLike: function () {
    var that = this;
    if (that.data.workLikeList.length >= that.data.likeTotal) {
      console.log('数据加载完毕');
    } else {
      if (that.data.workLikeList.length > 0) {
        that.setData({
          PageIndex: that.data.PageIndex += 1,
        }, function () {
          that.getWorkLikeList(that.data.PageIndex, PageSize, true)
        })
      } else {
        console.log("底部了")
      }
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    console.log("上拉加载更多");
    var tabIndex = that.data.tabIndex;
    if (tabIndex == 1) {
      if (that.data.tCommentList.length >= that.data.msgTotal) {
        console.log('数据加载完毕')
      } else {
        if (that.data.tCommentList.length > 0) {
          that.setData({
            PageIndex: that.data.PageIndex += 1,
          }, function () {
            that.getWorkCommentList(that.data.PageIndex, PageSize, true)
          })
        } else {
          console.log("底部了")
        }
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    // var imgurl = that.data.imgList[0].ImgUrl;
    if (res.from === 'button') { }
    return {
      title: that.data.workInfo.Title,
      // imageUrl: imgurl,
      path: '/pages/worksDetail/worksDetail?wid=' + that.data.wid
    }
  },
})