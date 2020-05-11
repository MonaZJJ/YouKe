//个人主页
const app = getApp();
var util = require('../../utils/util.js');
//每页显示的记录数
var PageSize = 2;
Page({
  data: {
    uid: "",
    personalInfo: "",
    workList: [],
    winningList: [],
    total: 0,
    showShareImg: false,
    avatar: "",
    qrcodeUrl: ""
  },
  //转到作品详情页
  goDetail: function(e) {
    var wid = e.currentTarget.dataset.wid;
    wx.navigateTo({
      url: '/pages/worksDetail/worksDetail?wid=' + wid
    })
  },
  //获取作品列表
  getUserWorksList: function(PageIndex, PageSize, loadermore) {
    var that = this;
    var url = "/Works/GetUserWorkList";
    var requestData = {
      "UId": that.data.uid,
      "PageModel": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      }
    }
    util.netRequest(url, requestData, function(data) {
      if (data.Code == "100") {
        if (loadermore) {
          that.setData({
            workList: that.data.workList.concat(data.Data.List),
            total: data.Data.Total
          }, function() {
            that.addClassName();
          })
        } else {
          that.setData({
            workList: data.Data.List,
            total: data.Data.Total
          }, function() {
            that.addClassName();
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
  //获取获奖作品列表
  getUserWinningList: function(PageIndex, PageSize, loadermore) {
    var that = this;
    var url = "/Works/GetUserWinnerWorkList";
    var requestData = {
      "UId": that.data.uid,
      "PageModel": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      }
    }
    util.netRequest(url, requestData, function(data) {
      if (data.Code == "100") {
        if (loadermore) {
          that.setData({
            winningList: that.data.winningList.concat(data.Data.List),
            total: data.Data.Total
          }, function() {
            that.addClassName();
          })
        } else {
          that.setData({
            winningList: data.Data.List,
            total: data.Data.Total
          }, function() {
            that.addClassName();
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
  //未关注时调用添加关注接口
  show: function(e) {
    var uid = e.currentTarget.dataset.id;
    var that = this;
    var url = '/UCenter/AddUserFollows';
    var requestData = {
      FollowUId: uid
    }
    util.netRequest(url, requestData, function(data) {
      if (data.Code == "100") {
        setTimeout(() => {
          wx.showToast({
            title: '关注成功',
            icon: "success",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 1000)
        }, 0);
        var PersonalInfo = that.data.personalInfo;
        PersonalInfo.FollowJudge = true;
        that.setData({
          personalInfo: PersonalInfo
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
    console.log("取消关注")
    var that = this;
    var uid = e.currentTarget.dataset.id;
    var url = '/UCenter/DeleteUserFollows';
    var requestData = {
      FollowUId: uid
    }
    util.netRequest(url, requestData, function(data) {
      if (data.Code == "100") {
        that.getUHomePageData();
      } else {
        wx.showModal({
          title: '提示',
          content: data.Message,
          showCancel: false,
        })
      }
    });
  },

  //关闭海报
  hidePoster: function() {
    this.setData({
      showShareImg: false,
    })
  },
  //生成分享卡
  posterShare: function(e) {
    console.log("生成海报");
    var that = this;
    that.setData({
      maskflag: true,
      showShareImg: true,
    }, function() {
      //获取网络图片本地路径
      wx.getImageInfo({
        src: that.data.personalInfo.Avatar, //服务器返回的图片地址
        success: function(res) {
          that.setData({
            avatar: res.path
          }, () => {
            //获取网络图片本地路径
            wx.getImageInfo({
              src: that.data.personalInfo.QrcodeUrl, //服务器返回的图片地址
              success: function(res) {
                that.setData({
                  qrcodeUrl: res.path
                }, () => {
                  that.sharePosteCanvas();
                })
              },
              fail: function(res) {
                //失败回调
                that.sharePosteCanvas();
              }
            });
          });
        },
        fail: function(res) {
          //失败回调
          that.sharePosteCanvas();
        }
      });
    });
  },
  // 保存分享卡
  posterSave: function(e) {
    console.log("保存海报");
    var that = this;
    that.setData({}, function() {
      that.saveShareImg();
    });
  },
  // 绘制分享卡
  sharePosteCanvas: function() {
    wx.showLoading({
      title: '图片生成中...',
      mask: true,
    })
    var that = this;
    var posterInfo = that.data.personalInfo;
    const ctx = wx.createCanvasContext('posterCanvas');
    wx.createSelectorQuery().select('#posterCanvas').boundingClientRect(function(res) {
      var height = res.height;
      var width = res.width;
      var r = 5;
      ctx.strokeStyle = "#fff";
      // // 左上角
      // ctx.arc(r, r, r, Math.PI, Math.PI * 1.5);
      // // border-top
      // ctx.moveTo(r, 0);
      // ctx.lineTo(width - r, 0);
      // ctx.lineTo(width, r);
      // // 右上角
      // ctx.arc(width - r, r, r, Math.PI * 1.5, Math.PI * 2);
      // // border-right
      // ctx.lineTo(width, height - r);
      // ctx.lineTo(width - r, height);
      // // 右下角
      // ctx.arc(width - r, height - r, r, 0, Math.PI * 0.5);
      // // border-bottom
      // ctx.lineTo(r, height);
      // ctx.lineTo(0, height - r);
      // // 左下角
      // ctx.arc(r, height - r, r, Math.PI * 0.5, Math.PI);
      // // border-left
      // ctx.lineTo(0, r);
      // ctx.lineTo(r, 0);
      // ctx.clip();
      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, width, height);
      ctx.save();

      // 头像
      if (posterInfo.Avatar) {
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.183, width * 0.145, 0, Math.PI * 2, false);
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        ctx.clip(); // 裁剪
        //res.path是网络图片的本地地址
        ctx.drawImage(that.data.avatar, width * 0.356, height * 0.076, width * 0.3, height *0.213 );
        ctx.restore();
      }

      // 昵称
      if (posterInfo.NickName.length > 0) {
        ctx.setFillStyle('#383838');
        ctx.setFontSize(width * 0.069);
        ctx.setTextAlign('center');
        if (posterInfo.NickName.length > 10) {
          var posterName = that.data.personalInfo.NickName
          posterName = posterName.substring(0, 10) + "...";
          ctx.fillText(posterName, width * 0.5, height * 0.36) //绘制文本
        } else {
          ctx.fillText(posterInfo.NickName, width * 0.5, height * 0.36) //绘制文本
        }
      }
      //个性签名
      if (posterInfo.Introduce.length > 0) {
        ctx.setFillStyle('#8A8A8A');
        ctx.setFontSize(width * 0.0436);
        ctx.setTextAlign('center');
        if (posterInfo.Introduce.length > 20) {
          var posterMotto = that.data.personalInfo.Introduce
          posterMotto = posterMotto.substring(0, 20) + "...";
          ctx.fillText(posterMotto, width * 0.5, height * 0.43) //绘制文本
        } else {
          ctx.fillText(posterInfo.Introduce, width * 0.5, height * 0.43)
        }
      }
      //个人作品数
      if (posterInfo.WorksCount == 0) {
        ctx.setFillStyle('#383838');
        ctx.setFontSize(width * 0.065);
        ctx.fillText("0", width * 0.24, height * 0.54);
        ctx.stroke();
      }
      if (posterInfo.WorksCount) {
        ctx.setFillStyle('#383838');
        ctx.setFontSize(width * 0.065);
        ctx.fillText(posterInfo.WorksCount, width * 0.24, height * 0.54);
        ctx.stroke();
      }

      ctx.setFillStyle('#383838');
      ctx.setFontSize(width * 0.047);
      ctx.fillText("个人作品", width * 0.24, height * 0.59);
      ctx.stroke();


      //个人点赞数
      if (posterInfo.UserLikesCount == 0) {
        ctx.setFillStyle('#383838');
        ctx.setFontSize(width * 0.065);
        ctx.fillText("0", width * 0.75, height * 0.54);
        ctx.stroke();
      }
      if (posterInfo.UserLikesCount) {
        ctx.setFillStyle('#383838');
        ctx.setFontSize(width * 0.065);
        ctx.fillText(posterInfo.UserLikesCount, width * 0.75, height * 0.54);
        ctx.stroke();
      }
      ctx.setFillStyle('#383838');
      ctx.setFontSize(width * 0.047);
      ctx.fillText("点赞数", width * 0.753, height * 0.59);
      ctx.stroke();

      //绘制一条线
      ctx.setStrokeStyle("#666666");
      ctx.moveTo(width * 0.036, height * 0.64);
      ctx.lineTo(width * 0.96, height * 0.64);
      ctx.setLineWidth(0.1);
      ctx.stroke();
      // 绘制二维码
      if (posterInfo.QrcodeUrl) {
        ctx.drawImage(that.data.qrcodeUrl, width * 0.345, height * 0.7, width * 0.33, height * 0.24)
      }
    }).exec()
    //生成图片设置的时间
    setTimeout(function() {
      ctx.draw(); //这里有个需要注意就是，这个方法是在绘制完成之后在调用，不然容易其它被覆盖。
      wx.hideLoading();
    }, 100)
  },

  //点击保存到相册
  saveShareImg: function() {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function() {
      wx.canvasToTempFilePath({
        quality: 1,
        fileType: 'png',
        canvasId: 'posterCanvas',
        success: function(res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function(res) {
              //将图片保存到本地
              wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success: function(res) {
                  wx.showToast({
                    title: '已下载到手机相册',
                    icon: "none",
                    duration: 1000
                  })
                },
                fail: function(res) {
                  wx.showToast({
                    title: '下载失败，请直接截屏',
                    icon: "none",
                    duration: 1000
                  });
                }
              });
            },
            fail: function(res) {
              wx.showModal({
                title: '提示',
                content: '同意微信授权用户信息',
                success: function(res) {
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

  // 个人主页信息数据 
  getUHomePageData: function() {
    var that = this;
    var url = "/UCenter/UHomePageData";
    var requestData = {
      FollowUId: that.data.uid
    };
    util.netRequest(url, requestData, function(data) {
      if (data.Code == 100) {
        that.setData({
          personalInfo: data.Data
        },function(){
          that.getUserWorksList(that.data.PageIndex, PageSize);
          that.getUserWinningList(that.data.PageIndex, PageSize);
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
  //点击点赞
  likesClick: function(e) {
    var islike = e.currentTarget.dataset.islike;
    if (islike) {
      this.addUsersLikes();
    } else {
      this.cancelUsersLikes();
    }
  },
  // 个人主页点赞
  addUsersLikes: function() {
    var that = this;
    var url = "/UCenter/DeleteUsersLikes";
    var requestData = {
      "LikeUId": that.data.uid
    };
    util.netRequest(url, requestData, function(data) {
      if (data.Code == 100) {
        that.getUHomePageData();
      } else {
        wx.showModal({
          title: '提示',
          content: data.Message,
          showCancel: false
        })
      }
    })
  },
  // 个人主页取消点赞
  cancelUsersLikes: function() {
    var that = this;
    var url = "/UCenter/AddUsersLikes";
    var requestData = {
      "LikeUId": that.data.uid
    };
    util.netRequest(url, requestData, function(data) {
      if (data.Code == 100) {
        setTimeout(() => {
          wx.showToast({
            title: '谢谢您的点赞！',
            icon: "success",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 1000)
        }, 0);
        var PersonalInfo = that.data.personalInfo;
        PersonalInfo.LikesJudge = true;
        that.setData({
          personalInfo: PersonalInfo
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
  addClassName: function() {
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
  refreshListData: function(e) {
    var that = this;
    var newWorkList = e.detail.workList;
    that.setData({
      workList: newWorkList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (!options.scene) {
      that.setData({
        uid: options.uid
      })
    } else {
      //二维码进入
      that.setData({
        uid: options.scene
      })
    }
    var systemUid = wx.getStorageSync('uid');
    that.setData({
      systemUid: systemUid
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (that.data.systemUid == that.data.uid) {
      that.setData({
        showFollowBtn: false
      })
    } else {
      that.setData({
        showFollowBtn: true
      })
    }
    that.setData({
      workList: [],
      winningList: [],
      PageIndex: 1
    }, function() {
      that.getUHomePageData();
    });
  },

  /**
   * 分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') { }
    return {
      path: '/pages/personPage/personPage?uid=' + that.data.uid
    }
  },
})