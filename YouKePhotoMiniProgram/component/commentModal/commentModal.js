// component/commentModal/commentModal.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {

    //  显示隐藏
    show: {
      type: Boolean,
      value: false
    },
    // 作品id
    wid: {
      type: Number,
      value: 0
    },
    // 回复会员id
    uid: {
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    textareaText: "",
    surplusNum: 150, //还可输入的字数,最多150
    keyboardHeight: '100rpx',  //键盘高度
  },
  
  onShow:function(){


    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 聚焦
    focusEvent: function (e) {
      console.log('键盘高度：', e.detail.height);
      this.setData({
        keyboardHeight: e.detail.height + 'px'
      })
      console.log(this.data.keyboardHeight)
    },
    //失去焦点时
    blurEvent: function () {
      this.setData({
        keyboardHeight: '100rpx',
      })
    },

    changeTextareaEvent: function (e) {
      var that = this;
      var text = e.detail.value;
      if (text.length < 150) {
        that.setData({
          surplusNum: 150 - text.length,
          textareaText: text
        })
      } else {
        that.setData({
          surplusNum: 0,
          textareaText: text
        })
      }
    },

    //发送评论
    sendOutEvent: function (e) {
      var that = this;
      var wid = e.currentTarget.dataset.wid;
      var uid = e.currentTarget.dataset.uid;
      var text = that.data.textareaText;
      if (text == null || text == "") {
        wx.showModal({
          title: '提示',
          content: "请输入评论",
          showCancel: false
        })
        return false;
      }
      //调用接口发送评论
      var url = "/Works/LeaveMessageForWork";
      var requestData = {
        WId: wid,
        UId: uid,
        Content: text
      };
      util.netRequest(url, requestData, function (data) {
        if (data.Code == 100) {
          that.setData({
            show: false,
            surplusNum:150
          },function(){
            setTimeout(() => {
              wx.showToast({
                title: '留言成功',
                icon: "success",
              });
              setTimeout(() => {
                wx.hideToast();
              }, 1000)
            }, 0);  
            that.triggerEvent('refreshListData', { "leaveMsg": true, "wid": wid });
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

    //隐藏弹框
    hideModal() {
      this.setData({
        show: false,
        textareaText: '',
        surplusNum: 150,
        keyboardHeight: '100rpx'
      })
    },
    //展示弹框
    showModal() {
      this.setData({
        show: true,
        textareaText: '',
        surplusNum: 150
      })
    },

    // 禁止滚动
    holdPositon(e) { },

  }
})