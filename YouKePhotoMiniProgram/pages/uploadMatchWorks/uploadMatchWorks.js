const app = getApp();
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reminder:"",

    show: false, //是否弹出弹窗
    txtRealContent: '', //作品说明文本
    ImgUrl: "", //图片路经
    isImgShow: false, //  是否已上传图片
    checked: false, //  checkbox协议选择

    type: 0, // 0:标签、1:设备选择 2:用户协议
    paddingTop: 38, //  scroll的margin-top值

    tabListSelect: "", //选中的标签组
    tabList: '', // 标签组
    hasTabList:true,
    groupId: 0,  //选中的分组id-单选

    ActivityField: "", //表单列表
  },

  //获取温馨提示
  getActFlyRemindInfo: function () {
    var that = this;
    var url = "/Activity/GetActivityFriendlyRemindInfo";
    var requestData = {
      "AId": that.data.aid
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        that.setData({
          reminder: data.Data.FriendlyRemind
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


  //协议勾选
  checkboxChange: function () {
    var oldChecked = this.data.checked;
    this.setData({
      checked: !oldChecked
    })
  },

  // 作品说明文本
  txtInput(e) {
    this.setData({
      txtRealContent: e.detail.value
    });
  },

  //选择图片
  addImgClick: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        that.setData({
          ImgUrl: res.tempFilePaths[0],
          RelativeImgUrl: res.tempFilePaths[0],
          isImgShow: true
        });
      }
    });
  },

  //  分组选择
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
    var url = "/Activity/GetActivityGroupList";
    var requestData = {
      "AId": that.data.aid
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        var list = data.Data.List;
        for (var i = 0; i < list.length; i++) {
          list[i].isSelected = false;
        }
        that.setData({
          tabList: list
        },function(){
          if (that.data.tabList.length == 0){
            that.setData({
              hasTabList:false
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

  // 用户作品协议
  userAgreement: function (e) {
    var that = this;
    var showModal = that.selectComponent("#showModal");
    var url = "/Common/GetUserAgreement";
    var requestData = {};
    util.netRequest(url, requestData, function (data) {
      that.setData({
        paddingTop: 11,
        type: 2,
        Agreement: data,
        show: true
      }, function () {
        showModal.showModal();
        WxParse.wxParse('agreement', 'html', that.data.Agreement, that, 0);
      })
    })
  },

  //改变输入框的值
  changeIndexValue: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var activityField = that.data.ActivityField;
    activityField[index].Value = e.detail.value;
  },

  //获取表单列表 
  getActivityFields: function () {
    var that = this;
    var url = "/Works/GetActivityFields";
    var requestData = {
      "AId": that.data.aid
    };
    util.netRequest(url, requestData, function (data) {
      if (data.Code == 100) {
        var list = data.Data.List;
        for (var i = 0; i < list.length; i++) {
          list[i].Value = "";
        }
        that.setData({
          ActivityField: list
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
        content: '请输入作品主题',
        showCancel: false
      })
      return false;
    }
    // if (contentText == "" || contentText == null) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请输入作品说明',
    //     showCancel: false
    //   })
    //   return false;
    // }
    //分组集
    var list = that.data.tabList;
    if (list.length==0){
      that.setData({
        groupId:0
      })
    }else{
      var tabListSelect = that.data.tabListSelect;
      if (tabListSelect.length == 0) {
        wx.showModal({
          title: '提示',
          content: '请选择分组',
          showCancel: false
        })
        return false;
      }
    }
    if (that.data.ImgUrl == "" || that.data.ImgUrl == null) {
      wx.showModal({
        title: '提示',
        content: '请上传图片',
        showCancel: false
      })
      return false;
    }
    //协议
    if (!that.data.checked) {
      wx.showModal({
        title: '提示',
        content: '请阅读并勾选《参赛须知》',
        showCancel: false
      })
      return false;
    }

    //验证比赛表单必填项
    var activityField = that.data.ActivityField;
    var activityFieldNew = [];
    for (var i = 0; i < activityField.length; i++) {
      if (activityField[i].Required && activityField[i].Value == "") {
        wx.showModal({
          title: '提示',
          content: '请输入' + activityField[i].Name,
          showCancel: false
        });
        return false;
      }
      activityFieldNew.push({
        "Name": activityField[i].Name,
        "Value": activityField[i].Value
      });
    }
    that.publishWorks(title, contentText, activityFieldNew);
  },
  // 调用发布作品接口
  publishWorks: function (title, text, fields) {
    var that = this;

    wx.showLoading({
      title: "发布中..."
    });

    //请求头
    var header = util.getRequestHeader("/Works/PublishWorks");
    console.log("header:" + header);

    var requestData = {
      "Title": title,
      "Desc": text,
      "AId": that.data.aid,
      "ModelId": 0,
      "TabIdList": [],
      "Fields": fields,
      "GId": that.data.groupId
    };

    //图片上传到服务器
    wx.uploadFile({
      url: app.globalData.apiSever + '/Works/PublishWorks',
      filePath: that.data.ImgUrl,
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
                wx.reLaunch({
                  url: '/pages/activityDetails/activityDetails?aid=' + that.data.aid
                })
              }
            }
          })
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: data.Message,
            showCancel: false
          })
        }
      }
    });
  },

  // 每个item选择点击
  selectedItem: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var type = that.data.type;
    if (type == 0) { //分组
      that.setData({
        groupId: id
      });
    }
    else { }
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
        if (that.data.groupId == arr[i].RecordId) {
          selectList.push({
            "GroupName": arr[i].GroupName,
            "RecordId": arr[i].RecordId
          });
        }
      }
      that.setData({
        tabListSelect: selectList
      })
    }
    else { } //用户协议
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
      aid: options.aid,
      type: 0,
      tabListSelect: "",
      tabList: '',
      ActivityField: "",
    }, function () {
      that.getTabList();
      that.getActivityFields();
      that.getActFlyRemindInfo();
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


})