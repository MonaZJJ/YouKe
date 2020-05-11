const app = getApp();
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var PageSize = 20;

Page({
  data: {
    height: [],
    width: 220,
    boxHeight: 0, //瀑布流盒子高度

    aid: 0,      //活动id
    showShareImg: false,   // 海报
    poster: "",    //本地路径海报背景图
    qrcodeUrl: "",  //本地路径海报二维码

    activityInfo: "",    //活动详情
    ActivityDetail: "", //富文本例子
    ActivityStatus: 1,  //1.进行中 2.入围、3.晋级、4.获奖
    IsJoin: false,    //是否有参加
    IsOpen: false,    //是否进行中

    tabType: 1,        // 1:参赛作品 2：活动详情 3:入围、晋级、获奖
    state: 2,           // 1：最新 2：最热

    tabId: 0,           // 选中的标签id
    tabList: [],         //标签列表
    hasTabList: true,

    total: 0,      //作品总数
    workList: [],      //作品列表

    winnerWorkList: [],  // 获奖作品

    maskflag: false,     //弹窗(入围、晋级、获奖)
    promotionText: '入围',   // 入围、晋级、获奖文本
    level: 1,             //1.进行中(全部) 2.入围、3.晋级、4.获奖

    isMineShow: false,  //#我的
    mineList: "",    //我的列表数据
    loadingHtml: false, //是否已加载富文本

  },
  //去个人主页
  goPersonPage: function (e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/personPage/personPage?uid=' + uid
    })
  },
  //去作品放大图
  goPreviewMine: function (e) {
    var wid = e.currentTarget.dataset.wid;
    wx.navigateTo({
      url: '/pages/preview/preview?wid=' + wid + "&idx=" + 0
    })
  },
  goPhoneModel: function () { }, //跳转到机型详情
  //去标签页面
  goSignWorks: function (e) {
    var tid = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '/pages/signWorks/signWorks?tid=' + tid
    })
  },
  // 上传作品点击
  uploadClick: function (e) {
    wx.navigateTo({
      url: "/pages/uploadMatchWorks/uploadMatchWorks?aid=" + this.data.aid
    })
  },
  //获取比赛信息  
  getActivityInfo: function () {
    var that = this;
    var aid = that.data.aid;
    var url = '/Activity/GetActivityInfo';
    var requestData = {
      "AId": aid
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        that.setData({
          activityInfo: data.Data.Info,
          IsFavorite: data.Data.IsFavorite,
          ActivityDetail: data.Data.ActivityDetail,
          ActivityStatus: data.Data.ActivityStatus,
          IsJoin: data.Data.IsJoin,
          IsOpen: data.Data.IsOpen
        }, function () {
          if (that.data.ActivityStatus == 4) {
            that.getSimpleWinnerWorkList();
          }
          that.getActivityTabList();
          that.getActivityWorkList(that.data.PageIndex, PageSize);
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
  //获取前三获奖作品列表数据
  getSimpleWinnerWorkList: function () {
    var that = this;
    var aid = that.data.aid;
    var url = '/Works/GetSimpleWinnerWorkList';
    var requestData = {
      "AId": aid
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        that.setData({
          winnerWorkList: data.Data.List
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
  //收藏比赛
  favoriteActivity: function () {
    var that = this;
    var url = '/Activity/FavoriteActivity';
    var requestData = {
      "AId": that.data.aid,
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        var isfavorite = that.data.IsFavorite;
        that.setData({
          IsFavorite: !isfavorite
        }, function () {
          wx.showToast({
            title: '收藏成功',
            icon: "success",
            duration: 1000
          });
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
  //取消收藏比赛
  unFavoriteActivity: function () {
    var that = this;
    var url = '/Activity/UnFavoriteActivity';
    var requestData = {
      "AId": that.data.aid,
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        var isfavorite = that.data.IsFavorite;
        that.setData({
          IsFavorite: !isfavorite
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
  //获取比赛标签列表 
  getActivityTabList: function (callback) {
    var that = this;
    var aid = that.data.aid;
    var url = '/Activity/GetActivityTabList';
    var requestData = {
      "AId": aid,
      "Level": that.data.level
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        that.setData({
          tabList: data.Data.List
        }, function () {
          var tlist = that.data.tabList;
          if (tlist.length == 0) {
            that.setData({
              hasTabList: false
            })
          }
          typeof callback === "function" ? callback() : false;
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
  //#我的点击
  mineClick: function () {
    var that = this;
    var ismineshow = that.data.isMineShow;
    var lev = that.data.level;
    that.setData({
      isMineShow: !ismineshow,
      tabId: 0,
      PageIndex: 1,
      height: []
    }, function () {
      if (ismineshow) {
        if (lev == 4) {
          that.selectedGroupFirst();
          // that.getEndingActivityWorkList(that.data.PageIndex, PageSize);
        } else {
          that.getActivityWorkList(that.data.PageIndex, PageSize);
        }
      } else {
        that.getUserActivityWorkInfo();
      }
    })
  },
  //获取#我的数据
  getUserActivityWorkInfo: function () {
    var that = this;
    var url = '/Works/GetUserActivityWorkInfo';
    var requestData = {
      "AId": that.data.aid,
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        that.setData({
          mineList: data.Data.List
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
  //获取比赛作品列表数据 ActivityStatus=1.2.3
  getActivityWorkList: function (PageIndex, PageSize, loadermore) {
    var that = this;
    var aid = that.data.aid;
    var url = '/Works/GetActivityWorkList';
    var requestData = {
      "AId": aid,
      "TId": that.data.tabId,
      "OrderModel": that.data.state,
      "PageModel": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      },
      "Level": that.data.level
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        if (loadermore) {
          that.setData({
            workList: that.data.workList.concat(data.Data.List),
            total: data.Data.Total
          })
        } else {
          that.setData({
            workList: data.Data.List,
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

  //选择分组标签第一个
  selectedGroupFirst: function () {
    var that = this;
    var tablist = that.data.tabList;
    if (tablist.length != 0) {
      var id = tablist[0].RecordId;
      that.setData({
        tabId: id
      }, function () {
        that.getEndingActivityWorkList(that.data.PageIndex, PageSize);
      })
    } else {
      that.setData({
        tabId: 0
      }, function () {
        that.getEndingActivityWorkList(that.data.PageIndex, PageSize);
      })
    }
  },
  //获取结束比赛作品列表数据 ActivityStatus=4
  getEndingActivityWorkList: function (PageIndex, PageSize, loadermore) {
    var that = this;
    var aid = that.data.aid;
    var url = '/Works/GetEndingActivityWorkList';
    var requestData = {
      "AId": aid,
      "TId": that.data.tabId,
      "OrderModel": that.data.state,
      "PageModel": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      },
      "Level": that.data.level
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
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
            if (that.data.workList.length != 0) {
              that.addClassName();
            }
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
  // 组件刷新列表页面数据
  refreshListData: function (e) {
    var that = this;
    var leaveMsg = e.detail.leaveMsg;

    if (leaveMsg) {
      var wid = e.detail.wid;
      var workList = that.data.workList;
      for (var i = 0; i < workList.length; i++) {
        if (workList[i].WorkId == wid) {
          workList[i].CommentCount = workList[i].CommentCount + 1;
        }
      }
      that.setData({
        workList: workList
      })
    } else {
      var newWorkList = e.detail.workList;
      that.setData({
        workList: newWorkList
      })
    }
  },

  // 禁止页面滚动
  holdPositon: function () { },
  // 收藏点击
  collectClick: function (e) {
    var that = this;
    var isfavorite = that.data.IsFavorite;
    if (isfavorite) {
      that.unFavoriteActivity();
    } else {
      that.favoriteActivity();
    }
  },
  // 参赛作品、活动详情切换
  tabSwitch: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    that.setData({
      tabType: type,
      state: 1,
      level: 1,
      PageIndex: 1,
      workList: [],
      height: [],
      tabId: 0,
      isMineShow: false,
    }, function () {
      if (type == 1) {
        that.getActivityWorkList(that.data.PageIndex, PageSize);
        that.getActivityTabList();
      } else {
        if (!that.data.loadingHtml) {
          that.setData({
            loadingHtml: true
          }, function () {
            wx.showLoading({
              title: '加载中',
            })
            WxParse.wxParse('activityDetail', 'html', that.data.ActivityDetail, that, 0);
            wx.hideLoading();
          })
        }
      }
    })
  },
  // 入围，晋级，获奖tab点击
  tabThirdClick: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var text = that.data.promotionText;
    if (text == "入围") {
      that.setData({
        level: 2
      })
    } else if (text == "晋级") {
      that.setData({
        level: 3
      })
    } else {
      that.setData({
        level: 4
      })
    }
    that.setData({
      tabType: type,
      tabId: 0,
      state: 2,
      PageIndex: 1,
      workList: [],
      height: [],
      isMineShow: false,
    }, function () {
      that.getActivityTabList(function () {
        if (that.data.level == 4) {
          that.selectedGroupFirst();
        } else {
          that.getActivityWorkList(that.data.PageIndex, PageSize);
        }
      });
    })
  },
  //入围作品，晋级作品、获奖作品右边下拉按钮点击
  showMaskflag: function () {
    this.setData({
      state: 2,
      maskflag: true,
    })
  },
  //入围作品，晋级作品、获奖作品下拉选项点击
  proBtnClick: function (e) {
    var that = this;
    var text = e.currentTarget.dataset.text;
    var id = e.currentTarget.dataset.id;
    that.setData({
      promotionText: text,
      level: id,
      PageIndex: 1,
      workList: [],
      height: [],
      tabId: 0,
      tabType: 3,
      isMineShow: false,
    }, function () {
      that.getActivityTabList(function () {
        if (that.data.level == 4) {
          that.selectedGroupFirst();
        } else {
          that.getActivityWorkList(that.data.PageIndex, PageSize)
        }
      });
      that.closeMask();
    })
  },
  // 最新、最热点击
  stateClick: function (e) {
    var that = this;
    var sta = e.currentTarget.dataset.state;
    that.setData({
      state: sta,
      PageIndex: 1,
      workList: [],
      height: [],
      level: 1,
      isMineShow: false,
    }, function () {
      that.getActivityWorkList(that.data.PageIndex, PageSize);
    })
  },

  // 标签点击
  signSelected: function (e) {
    var that = this;
    var tid = e.currentTarget.dataset.tid;
    if (that.data.level == 4) {
      var newTid = tid;
    } else {
      var newTid = 0;
      if (that.data.tabId != tid) {
        newTid = tid;
      }
    }
    that.setData({
      PageIndex: 1,
      workList: [],
      height: [],
      isMineShow: false,
      tabId: newTid
    }, function () {
      if (that.data.level == 4) {
        that.getEndingActivityWorkList(that.data.PageIndex, PageSize);
      } else {
        that.getActivityWorkList(that.data.PageIndex, PageSize);
      }
    })
  },

  // 关闭弹窗
  closeMask: function () {
    var that = this;
    that.setData({
      showShareImg: false,
      maskflag: false
    });
  },
  //生成分享卡
  posterShare: function (e) {
    var that = this;
    var actInfo = that.data.activityInfo;
    that.setData({
      showShareImg: true,
    }, function () {
      //获取网络图片本地路径
      wx.getImageInfo({
        src: actInfo.Poster,
        success: function (res) {
          that.setData({
            poster: res.path
          }, () => {
            wx.getImageInfo({
              src: actInfo.QrcodeUrl,
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
    this.saveShareImg();
  },

  // 绘制分享卡
  sharePosteCanvas: function () {
    wx.showLoading({
      title: '图片生成中...',
      mask: true,
    })
    var that = this;
    var posterInfo = that.data.activityInfo;
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

      ctx.fillRect(0, 0, width, height);
      ctx.setFillStyle('#fff');
      ctx.save();

      //海报背景
      if (posterInfo.Poster) {
        ctx.drawImage(that.data.poster, 0, 0, width, height * 0.75);
      }
      //海报名字
      if (posterInfo.Title.length > 0) {
        ctx.setFillStyle('#383838');
        ctx.setFontSize(width * 0.045);
        if (posterInfo.Title.length > 12) {
          var posterName = that.data.activityInfo.Title;
          posterName = posterName.substring(0, 12) + "...";
          ctx.fillText(posterName, width * 0.035, height * 0.80); //绘制文本
        } else {
          ctx.fillText(posterInfo.Title, width * 0.035, height * 0.80); //绘制文本
        }
      }
      //海报副标题
      if (posterInfo.SmallTitle) {
        ctx.setFillStyle('#8A8A8A');
        ctx.setFontSize(width * 0.035);
        if (posterInfo.SmallTitle.length > 18) {
          var posterMotto = that.data.activityInfo.SmallTitle;
          posterMotto = posterMotto.substring(0, 18) + "...";
          ctx.fillText(posterMotto, width * 0.035, height * 0.85); //绘制文本
        } else {
          ctx.fillText(posterInfo.SmallTitle, width * 0.035, height * 0.85); //绘制文本
        }
      }
      //绘制一条线
      ctx.setFillStyle("#000000");
      ctx.moveTo(width * 0.036, height * 0.94);
      ctx.lineTo(width * 0.2, height * 0.94);
      ctx.setLineWidth(0.2);
      ctx.stroke();
      // 绘制二维码
      if (that.data.qrcodeUrl) {
        ctx.drawImage(that.data.qrcodeUrl, width * 0.69, height * 0.785, width * 0.25, height * 0.18);
      }
    }).exec()
    //生成图片设置的时间
    setTimeout(function () {
      ctx.draw();
      wx.hideLoading();
    }, 1000)
  },
  // 把网络图片改成临时路径
  downLoad: function (e) {
    var that = this;
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

  // 瀑布流
  loadImg(e) {  // 监听图片加载完 获取图片的高度
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    that.setData({
      height: [...this.data.height, e.detail.height]
    }, function () {
      that.showImg();  // 调用渲染函数
    })
  },
  showImg() {
    var that = this;
    let height = this.data.height;
    if (height.length != this.data.workList.length) {  // 保证所有图片加载完
      return false;
    }
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('.srItem').boundingClientRect((ret) => {
        let cols = 3;
        var group = that.data.workList;
        var heightArr = [];
        for (var i = 0; i < ret.length; i++) {
          var boxHeight = ret[i].height;
          if (i < cols) {  //图片前三张
            heightArr.push(boxHeight + 5);  //存前三张图片的高度，相当于每列的初始高度
          } else {  //存多于三张图片时
            var minBoxHeight = Math.min.apply(null, heightArr);   //取数组中最小值
            var minBoxIndex = that.getMinBoxIndex(minBoxHeight, heightArr);
            group[i].zIndex = '3';
            group[i].position = 'absolute';
            group[i].top = minBoxHeight + 'px';
            group[i].left = minBoxIndex == 0 ? minBoxIndex * that.data.width + 'rpx' : minBoxIndex * that.data.width + 12 * minBoxIndex + 'rpx';
            heightArr[minBoxIndex] += (boxHeight + 5);
          }
        }
        var maxBoxHeight = Math.max.apply(null, heightArr);
        that.setData({
          workList: group,
          boxHeight: maxBoxHeight
        })
        wx.hideLoading();
      }).exec()
    }, 500)
  },
  //找最小值的下标值
  getMinBoxIndex: function (val, arr) {
    for (var i in arr) {
      if (arr[i] == val) {
        return i
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (!options.scene) {
      that.setData({
        aid: options.aid
      })
    } else {
      //二维码进入
      that.setData({
        aid: options.scene
      })
    }
    that.setData({
      PageIndex: 1,
      workList: [],
      height: [],
      level: 1,
      isMineShow: false,  //#我的
      tabType: 1,   // 1:参赛作品 2：活动详情 3:入围、晋级、获奖
      state: 2,     // 1：最新 2：最热
      tabId: 0,     // 选中的标签id  
      loadingHtml: false,
    }, function () {
      that.getActivityInfo();
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

  },

  //上拉刷新 加载更多
  onReachBottom: function () {
    var that = this;
    var ismineshow = that.data.isMineShow;
    if (that.data.workList.length >= that.data.total) {
      console.log('数据加载完毕')
    } else {
      if (that.data.workList.length > 0) {
        that.setData({
          PageIndex: that.data.PageIndex += 1,
        }, function () {
          if (that.data.level == 4) {
            that.getEndingActivityWorkList(that.data.PageIndex, PageSize, true)
          } else {
            if (!ismineshow) {
              that.getActivityWorkList(that.data.PageIndex, PageSize, true)
            }
          }
        })
      } else {
        console.log("底部了")
      }
    }
  },

  // 添加活动分享
  addActivityShares: function () {
    var that = this;
    var aid = that.data.aid;
    var url = '/Activity/AddActivityShares';
    var requestData = {
      "AId": aid
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        console.log("活动转发成功");
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
  * 分享
  */
  onShareAppMessage: function (res) {
    var that = this;
    // if (res.from === 'button') {}
    that.addActivityShares();
    return {
      title: that.data.activityInfo.Title,
      imageUrl: that.data.activityInfo.Cover,
      path: '/pages/activityDetails/activityDetails?aid=' + that.data.aid,
    }
  }

})