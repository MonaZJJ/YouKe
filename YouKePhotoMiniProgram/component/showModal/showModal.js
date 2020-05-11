Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //  按钮文本
    btnText: {
      type: String,
      value: '确定'
    },

    // scroll的margin-top值
    paddingTop: {
      type: Number,
      value: 0
    },

    // 背景图片
    bgShow: {
      type: Boolean,
      value: false
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //隐藏弹框
    hideModal() {
      this.setData({
        show: false
      })
      //触发隐藏弹框回调
      this.triggerEvent("hideModal");
    },
    //展示弹框
    showModal() {
      this.setData({
        show: true
      })
    },
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent");
    },
    _confirmEvent() {
      this.setData({
        show: false
      })
      //触发成功回调
      this.triggerEvent("confirmEvent");
    },

    // 禁止滚动
    holdPositon(e) { },

  }
})
