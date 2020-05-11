const app = getApp();
var util = require('../../utils/util.js');
var PageSize = 12;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: [],
    width: 331,
    boxHeight: 0, //瀑布流盒子高度

    tid: "",
    imgWidth: 0,
    imgHeight: 0,
    tabName: "",

    List: [],
    total: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      tid: options.tid,
      tabName:options.pname,
      PageIndex: 1
    }, function () {
      that.getSignList(that.data.PageIndex, PageSize);
    })
  },

  onShow: function () {

  },

  goDetail: function (e) {
    var wid = e.currentTarget.dataset.wid;
    wx.navigateTo({
      url: '../worksDetail/worksDetail?wid=' + wid,
    })
  },

  //获取标签作品
  getSignList: function (PageIndex, PageSize, loadermore) {
    var that = this;
    var url = "/Works/GetPhoneWorkList";
    var requestData = {
      "TabId": that.data.tid,
      "PageModel": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
      }
    }
    util.netRequest(url, requestData, function (data) {
      if (data.Code == "100") {
        if (loadermore) {
          that.setData({
            List: that.data.List.concat(data.Data.List),
            total: data.Data.Total,
          })
        } else {
          that.setData({
            List: data.Data.List,
            total: data.Data.Total,
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
  /**
   * 页面上拉触底事件的处理函数
   */
  //上拉刷新 加载更多
  onReachBottom: function () {
    var that = this;
    if (that.data.List.length >= that.data.total) {
      console.log('数据加载完毕')
    } else {
      if (that.data.List.length > 0) {
        that.setData({
          PageIndex: that.data.PageIndex += 1,
        }, function () {
          that.getSignList(that.data.PageIndex, PageSize, true)
        })
      } else {
        console.log("底部了")
      }
    }
  },
  // 瀑布流
  loadImg(e) { // 监听图片加载完 获取图片的高度
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      height: [...this.data.height, e.detail.height]
    })
    this.showImg() // 调用渲染函数
  },
  showImg() {
    var that = this;
    let height = this.data.height
    if (height.length != this.data.List.length) { // 保证所有图片加载完
      return false;
    }
    setTimeout(() => { // 异步执行
      wx.createSelectorQuery().selectAll('.srItem').boundingClientRect((ret) => {
        let cols = 2;
        var group = that.data.List;
        var heightArr = [];
        for (var i = 0; i < ret.length; i++) {
          var boxHeight = ret[i].height
          if (i < cols) {
            heightArr.push(boxHeight + 8);
          } else { //存多于三张图片时
            var minBoxHeight = Math.min.apply(null, heightArr); //取数组中最小值
            var minBoxIndex = that.getMinBoxIndex(minBoxHeight, heightArr);
            group[i].position = 'absolute';
            group[i].top = minBoxHeight + 'px';
            group[i].left = minBoxIndex == 0 ? minBoxIndex * that.data.width + 'rpx' : minBoxIndex * that.data.width + 15 * minBoxIndex + 'rpx';
            heightArr[minBoxIndex] += (boxHeight + 8);
          }
        }
        var maxBoxHeight = Math.max.apply(null, heightArr);
        that.setData({
          List: group,
          boxHeight: maxBoxHeight
        })
        wx.hideLoading()
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
})