const app = getApp();
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isStopBodyScroll: true, //页面滚动  true滚动 false不滚动

    ImgNum: 0, //图片的张数
    ImgList: [], //图片集
    imgClassName: "box1",

    imgIndex: -1, //拖动图片的下标值
    targetImgImdex: -1, //目标图片的下标值
    topAndLeft: "", //拖动图片时的style
    left: 0, //鼠标left
    top: 0, //鼠标top
    dragImg: "", //拖动图片路径
    targetImg: "", //目标图片路径
    imgInfoArray: '', // 图片数组信息（位置，宽高）

  },

  //拖动图片
  imagetouchmove: function (e) {
    var that = this;
    var left = e.touches[0].clientX - 55;
    var top = e.touches[0].clientY - 65;
    var styleText = "top:" + top + "px;left:" + left + "px;";
    var src = e.currentTarget.dataset.src; //获取拖动图片的路径
    var index = e.currentTarget.dataset.index; //获取拖动图片的路径
    that.setData({
      dragImg: src,
      imgIndex: index,
      isStopBodyScroll: false //禁止页面滚动
    })

    if (this.data.ImgList.length > 1) {
      that.setData({
        left: left,
        top: top,
        topAndLeft: styleText
      })
    } else {
      //只有一张图片时，不能拖动（选中的图片下标值imgIndex设置-1）
      that.setData({
        left: 0,
        top: 0,
        topAndLeft: "",
        imgIndex: -1
      })
    }
    // console.log("点击拖动图片,src=" + src+ ",left:" + that.data.left + ",top:" + that.data.top);
  },

  //拖动结束
  imagetouchend: function (e) {
    var that = this;
    var src = e.currentTarget.dataset.src; //获取拖动图片的路径
    var index = e.currentTarget.dataset.index; //获取拖动图片的下标值
    that.ifOtherArea(index, src);
    // console.log("拖动结束:index"+index,"拖动图片src"+src);
  },

  // 每张图片（view）的位置
  initTypeArr() {
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    wx.createSelectorQuery().selectAll('.imgView').boundingClientRect(function (rect) {
      var array = [];
      for (var i = 0; i < rect.length; i++) {
        array.push({
          "top": rect[i].top,
          "bottom": rect[i].bottom,
          "left": rect[i].left,
          "right": rect[i].right
        });
      }
      that.setData({
        imgInfoArray: array
      })
      // console.log(array);
    }).exec()

    // setTimeout(() => {
    // }, 500)
  },

  //判断鼠标是否移动到其他照片区域
  ifOtherArea: function (index, src) {
    var that = this;
    var top = this.data.top + 65;
    var left = this.data.left + 55;
    // console.log(top+","+left);
    var imgListArr = that.data.ImgList; //图片数组
    var imgInfoArr = that.data.imgInfoArray; //图片数组信息
    // console.log("未换位置前"+imgListArr);
    var t, b, l, r;
    for (var i = 0; i < imgListArr.length; i++) {
      t = imgInfoArr[i].top;
      b = imgInfoArr[i].bottom;
      l = imgInfoArr[i].left;
      r = imgInfoArr[i].right;
      // console.log(t,b,l,r);
      if (t <= top && top <= b && l <= left && left <= r) {
        // console.log("i:"+i,"index:"+index);
        imgListArr[index] = imgListArr[i];
        imgListArr[i] = src;
      }
    }
    that.setData({
      ImgList: imgListArr,
      topAndLeft: '',
      top: 0,
      left: 0,
      imgIndex: -1,
      isStopBodyScroll: true //页面滚动
    })
    // console.log("换完之后的list" + imgListArr)
  },

  //添加图片
  addImgClick: function () {
    var that = this;
    var num = this.data.ImgNum;
    console.log("当前图片个数", num);
    console.log("剩余图片个数", 9 - num);
    //剩余图片个数
    var canChooseImgNum = Number(9 - num);
    if (canChooseImgNum > 0) {
      wx.chooseImage({
        count: canChooseImgNum, // 默认9
        sizeType: ['original'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          that.setData({
            ImgList: that.data.ImgList.concat(res.tempFilePaths),
          }, function () {
            that.testingBox() //图片张数
            that.initTypeArr() //图片位置

            let pages = getCurrentPages(); //当前页面    （pages就是获取的当前页面的JS里面所有pages的信息）
            let prevPage = pages[pages.length - 2]; //上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
            prevPage.setData({
              imgListChange: true,
            });
          })
        }
      });
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '只能选9张图片',
        showCancel: false
      })
    }
  },

  // 下一步
  nextStepClick: function (e) {
    app.data.uploadImgList = this.data.ImgList;
    let pages = getCurrentPages(); //当前页面    （pages就是获取的当前页面的JS里面所有pages的信息）
    let prevPage = pages[pages.length - 2]; //上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    prevPage.setData({
      imgListChange: true,
    });
    wx.navigateBack({
      delta: 1,
    })
  },

  // 长按删除
  longTap: function (e) {
    var src = e.currentTarget.dataset.src; //获取长按图片的路径
    var index = e.currentTarget.dataset.index; //获取长按图片的下标值
    var that = this;
    var imgList = that.data.ImgList
    wx.showModal({
      title: '提示',
      content: '删除该照片吗？',
      success(res) {
        if (res.confirm) {
          imgList.splice(index, 1);
          that.setData({
            ImgList: imgList
          }, function () {
            that.testingBox() //图片张数
            that.initTypeArr() //图片位置
          })
          // console.log("删除后的数组集："+imgList);
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  // 检测图片张数以及设置图片的box
  testingBox: function (e) {
    console.log("图片列表", this.data.ImgList);
    var imgNum = this.data.ImgList.length;
    var that = this;
    that.setData({
      ImgNum: imgNum
    })
    switch (imgNum) {
      case 1:
        that.setData({
          imgClassName: "box1"
        })
        break;
      case 2:
        that.setData({
          imgClassName: "box2"
        })
        break;
      case 3:
        that.setData({
          imgClassName: "box3"
        })
        break;
      case 4:
        that.setData({
          imgClassName: "box4"
        })
        break;
      case 5:
        that.setData({
          imgClassName: "box5"
        })
        break;
      case 6:
        that.setData({
          imgClassName: "box6"
        })
        break;
      case 7:
        that.setData({
          imgClassName: "box7"
        })
        break;
      case 8:
        that.setData({
          imgClassName: "box8"
        })
        break;
      case 9:
        that.setData({
          imgClassName: "box9"
        })
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var uploadImgList = app.data.uploadImgList;
    that.setData({
      ImgList: uploadImgList,
      ImgNum: uploadImgList.length
    }, () => {
      that.testingBox(); //图片张数
      that.initTypeArr(); //图片位置
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


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let pages = getCurrentPages(); //当前页面 （pages就是获取的当前页面的JS里面所有pages的信息）
    let prevPage = pages[pages.length - 2]; //上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    prevPage.setData({
      imgListChange: true,
    });
    app.data.uploadImgList = this.data.ImgList;
    console.log("新图片列表-选择", app.data.uploadImgList);
  }
})