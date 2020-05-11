const app = getApp();
var util = require('../../utils/util.js');
var PageSize = 20;
Page({
  data: {
    title: "", //标题
    content: "", //内容
    time: "", //时间
    total: 0,
    list: [],
    nId:0,  //点击的nId
    type:2,

    hasSystemMessage: '',   //是否存在系统消息
    hasUserMessage: '',   //是否存在用户消息
    hasWorkMessage: ''  //是否存在作品消息
  },
  //普通通知，比赛通知切换
  changeTab: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.index;
    if (type != this.data.type) {
      that.setData({
        type: type,
        PageIndex: 1,
        list: [],
        total: ""
      },function(){
        that.newsUnread();
      })
    }
  },

  //获取消息是否有未读，红色圆点
  newsUnread:function(){
    var that = this;
    var url = '/Message/GetMessageStatus';
    var requestData = {}
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        that.setData({
          hasSystemMessage: data.Data.HasSystemMessage,
          hasUserMessage: data.Data.HasUserMessage,
          hasWorkMessage: data.Data.HasWorkMessage
        },function(){
          that.getMessagesList(that.data.PageIndex, PageSize)
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

  //页面显示
  onShow: function() {
    var that = this;
    that.setData({
      list: [],
      PageIndex: 1,
      type: 2
    }, function() {
      that.newsUnread();
    });
  },
  //消息点击
  newsClick: function(e) {
    var nid = e.currentTarget.dataset.nid;
    var that = this;
    var url = '/Message/GetMessageDetail';
    var requestData = {
      RecordId: nid
    }
    util.netRequest(url, requestData, function(data) {
      if (data.Code == "100") {
        that.setData({
          title: data.Data.MessageTitle,
          content: data.Data.MessageContent,
          time: data.Data.CreateTimeStr,
          nId:nid
        }, function() {
          var showModal = this.selectComponent("#showModal");
          showModal.showModal();
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

  // 确定按钮点击
  _confirmEvent:function(){
    this.changeStatus();
  },
  // 改变阅读状态
  changeStatus: function (){
    var that = this;
    var list = that.data.list;
    var nid = that.data.nId;
    for(var i = 0; i<list.length;i++){
      if (nid == list[i].RecordId && list[i].State == 0){
        list[i].State = 1;
      }
    }
    that.setData({
      list:list
    })
  },

  // 获取消息列表
  getMessagesList: function(PageIndex, PageSize, loadermore) {
    var that = this;
    var url = '/Message/GetMessageList';
    var requestData = {
      "Page": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      },
      "Type":that.data.type
    };
    util.netRequest(url, requestData, function(data) {
      if (data.Code == "100") {
        if (loadermore) {
          that.setData({
            list: that.data.list.concat(data.Data.MessageList),
            total: data.Data.Total
          })
        } else {
          that.setData({
            list: data.Data.MessageList,
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
  //上拉刷新 加载更多
  onReachBottom: function() {
    var that = this;
    if (that.data.list.length >= that.data.total) {
      console.log('数据加载完毕')
    } else {
      if (that.data.list.length > 0) {
        that.setData({
          PageIndex: that.data.PageIndex += 1,
        })
      } else {
        console.log("底部了")
      }
    }
  },
})