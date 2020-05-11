//app.js
App({
  onLaunch: function() {
    this.checkSystemInfo();
  },
  checkSystemInfo: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log('状态栏高度：', res.statusBarHeight);
        that.globalData.screenWidth = res.screenWidth;
        if (res.system.indexOf("iOS") > -1) {
          that.globalData.statusBarHeight = parseInt(res.statusBarHeight) + 4;
        } else {
          that.globalData.statusBarHeight = parseInt(res.statusBarHeight) + 10;
        }
      }
    })
  },
  globalData: {
    apiSever: "https://api.wzsjsy.com/api",
    severUrl: "https://api.wzsjsy.com/",

    // http://192.168.31.188:19124/
    // https://api.wzsjsy.com/

    apiSignKey: "yk@789kk-78$78",
    statusBarHeight: 20,
    screenWidth: 375
  },
  data: {
    uploadImgList: [], //上传的图片集
  }
})