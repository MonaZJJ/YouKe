const app = getApp();
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, //是否弹出弹窗

    ImgNum: 0, //图片张数
    ImgList: [], //图片集
    uploadedImgList: [], //已上传图片集
    txtRealContent: '', //作品说明文本

    type: 0, // 0:标签、1:设备选择
    paddingTop: 38, //  scroll的margin-top值

    tabListSelect: "", //选中的标签组
    tabList: '', // 标签组
    expListSelect: "", //选中的设备组
    expList: '', // 设备组
    expId: 0, //选中的设备id-单选
    imgListChange: false, //图片集是否变化
  },

  //去预览页面
  toPreviewPictures: function () {
    wx.navigateTo({
      url: '/pages/previewPictures/previewPictures'
    })
  },
  //添加图片
  addImgClick: function () {
    var that = this;
    var num = this.data.ImgNum;
    //剩余图片个数
    var canChooseImgNum = Number(9 - num);
    if (canChooseImgNum > 0) {
      wx.chooseImage({
        count: canChooseImgNum, // 默认9
        sizeType: ['original'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          var imglistNew = res.tempFilePaths;
          //将图片集存入全局app.js
          app.data.uploadImgList = that.data.ImgList.concat(imglistNew);
          console.log(imglistNew)
          that.setData({
            // ImgList: that.data.ImgList.concat(imglistNew),
            // ImgNum: that.data.ImgNum + imglistNew.length
          }, function () {
            that.toPreviewPictures();
          });
        }
      });
    }
  },

  // 作品说明文本
  txtInput(e) {
    this.setData({
      txtRealContent: e.detail.value
    });
  },

  // 标签选择
  groupingSelect: function (e) {
    var showModal = this.selectComponent("#showModal");
    this.setData({
      paddingTop: 38,
      type: 0,
      show: true
    }, function () {
      showModal.showModal();
    })
  },
  //获取分组标签数据
  getTabList: function () {
    var that = this;
    var url = "/Tab/GetTabList";
    var requestData = {};
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        var list = data.Data.TabList;
        for (var i = 0; i < list.length; i++) {
          list[i].isSelected = false;
        }
        that.setData({
          tabList: list
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

  //  设备选择
  equipmentSelect: function (e) {
    var showModal = this.selectComponent("#showModal");
    this.setData({
      paddingTop: 58,
      type: 1,
      show: true
    }, function () {
      showModal.showModal();
    })
  },
  //获取分组标签数据
  getPhoneModelList: function () {
    var that = this;
    var url = "/PhoneModel/GetPhoneModelList";
    var requestData = {};
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        that.setData({
          expList: data.Data.PhoneModelList
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

  // 发布
  formRelease: function (e) {
    var that = this;
    var title = e.detail.value.Title;
    var contentText = e.detail.value.ContentText;

    if (title == "" || title == null) {
      wx.showModal({
        title: '提示',
        content: '请输入作品标题',
        showCancel: false
      })
      return false;
    }
    //图片集相对路径
    var imgList = that.data.ImgList;
    var imgListNew = [];
    if (imgList.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请上传图片',
        showCancel: false
      })
      return false;
    } else {
      for (var i = 0; i < imgList.length; i++) {
        imgListNew.push(imgList[i]);
      }
    }
    //标签集
    var tabIdList = [];
    var tabListSelect = that.data.tabListSelect;
    if (tabListSelect.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入选择标签',
        showCancel: false
      })
      return false;
    } else if (tabListSelect.length > 5) {
      wx.showModal({
        title: '提示',
        content: '最多选择5个标签',
        showCancel: false
      })
      return false;
    } else {
      for (var i = 0; i < tabListSelect.length; i++) {
        tabIdList.push(tabListSelect[i].TabId);
      }
    }
    //设备集
    var expListSelect = that.data.expListSelect;
    if (expListSelect.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入选择设备',
        showCancel: false
      })
      return false;
    }
    that.UploadWorksImg(title, contentText, tabIdList, imgListNew);
  },

  // 调用上传作品接口
  UploadWorksImg: function (title, text, tabIdList, imgListNew) {
    var that = this;

    wx.showLoading({
      title: "上传作品中..."
    });

    //请求头
    var header = util.getRequestHeader("/Works/UploadWorksImg");
    console.log("header:" + header);

    var successUp = 0; //成功个数
    var failUp = 0; //失败个数
    var length = imgListNew.length; //总共个数
    var i = 0; //第几个
    var url = app.globalData.apiSever + '/Works/UploadWorksImg';
    util.uploadFiles(url, header, imgListNew, successUp, failUp, i, length, function (res) {
      var data = JSON.parse(res.data);
      if (data.Code == 100) {
        that.setData({
          uploadedImgList: that.data.uploadedImgList.concat(data.Data)
        });
      }
    }, function (res) {
      var data = JSON.parse(res.data);
      console.log(res);
      if (data.Code == 100) {
        console.log("OSS新图片列表", that.data.uploadedImgList);
        //上传作品成功，则发布作品
        that.publishWorks(title, text, tabIdList, imgListNew);
      } else {
        wx.showModal({
          title: '提示',
          content: data.Message,
          showCancel: false
        })
      }
    });
  },

  // 调用发布作品接口
  publishWorks: function (title, text, tabIdList, imgListNew) {
    var that = this;
    //请求头
    var header = util.getRequestHeader("/Works/PublishWorks");
    console.log("header:" + header);
    var requestData = {
      "Title": title,
      "Desc": text,
      "AId": 0,
      "ImgList": that.data.uploadedImgList,
      "ModelId": that.data.expId,
      "TabIdList": tabIdList,
      "Fields": [],
      "GId": 0
    };
    console.log("OSS新图片列表", that.data.uploadedImgList);
    if (that.data.uploadedImgList.length > 0) {
      wx.showLoading({
        title: "发布中..."
      });
      //图片上传到服务器
      wx.uploadFile({
        url: app.globalData.apiSever + '/Works/PublishWorks',
        filePath: imgListNew[0],
        name: 'file',
        header: header,
        formData: {
          "RequestData": JSON.stringify(requestData)
        },
        success: function (res) {
          var data = JSON.parse(res.data);
          console.log(res);
          if (data.Code == 100) {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: "您的作品已提交",
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  app.data.uploadImgList = [];
                  that.setData({
                    type: 0,
                    tabListSelect: "",
                    tabList: '',
                    expListSelect: "",
                    expList: '',
                    expId: 0,
                  }, function () {
                    wx.switchTab({
                      url: '/pages/index/index'
                    })
                  })
                }
              }
            });
          } else {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: data.Message,
              showCancel: false
            })
          }
        },
        fail: function (res) {
          that.setData({
            uploadedImgList: []
          });
        },
        complete: function (res) {
          wx.hideLoading();
        }
      });
    }
  },

  // 每个item选择点击
  selectedItem: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var type = that.data.type;
    if (type == 0) { //分组
      var list = that.data.tabList;
      var item = list[index];
      var num = 0;
      for (var i in list) {
        if (list[i].isSelected) {
          num += 1;
        }
      }
      if (!item.isSelected) {
        if (num >= 5) {
          wx.showModal({
            title: '提示',
            content: '选择不能超过5个',
            showCancel: false
          })
          return false;
        }
      }
      item.isSelected = !item.isSelected;
      that.setData({
        tabList: list
      });
    } else if (type == 1) { //设备
      that.setData({
        expId: id
      });
    } else { }
  },

  //弹窗关闭事件
  hideModal: function () {
    this.setData({
      show: false
    })
  },
  //弹窗确认事件
  _confirmEvent() {
    var that = this;
    var type = that.data.type;
    var selectList = [];
    if (type == 0) { //分组选择弹窗
      var arr = that.data.tabList;
      for (var i = 0; i < arr.length; i++) {
        var select = arr[i].isSelected;
        if (select) {
          selectList.push({
            "TabId": arr[i].TabId,
            "TabName": arr[i].TabName
          });
        }
      }
      that.setData({
        tabListSelect: selectList
      })
    } else if (type == 1) { //设备选择弹窗 
      var arr = that.data.expList;
      for (var i = 0; i < arr.length; i++) {
        if (that.data.expId == arr[i].ModelId) {
          selectList.push({
            "ModelId": arr[i].ModelId,
            "Name": arr[i].Name
          });
        }
      }
      that.setData({
        expListSelect: selectList
      })
    } else { }
    that.setData({
      show: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({

    }, function () {
      that.getTabList();
      that.getPhoneModelList();
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
  onShow: function (options) {
    var that = this;
    if (this.data.imgListChange) {
      var imglistNew = app.data.uploadImgList;
      console.log("新图片列表", app.data.uploadImgList);
      var num = imglistNew.length;
      this.setData({
        ImgList: imglistNew,
        ImgNum: num
      });
    }
  },
})