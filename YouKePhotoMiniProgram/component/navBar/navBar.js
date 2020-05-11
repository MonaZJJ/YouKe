// component/navBar/navBar.js
//获取应用实例
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showReturn: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    returnPrePage: function() {
      if (getCurrentPages().length == 1) {
        wx.switchTab({
          url: '../index/index',
        })
      } else {
        wx.navigateBack({

        })
      }
    }
  }
})