const app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    authenWorkCount: "", //认证作品数
    authenRecommendCount: "", //认证推荐数
    authenPromotionCount: "", //认证晋级数
    userWorkCount: "", //用户作品数
    userRecommendCount: "", //用户推荐数
    userPromotionCount: "", //晋级作品数
    posImg: '', //身份证正面
    oppImg: '', //身份证反面
    certificate: '', //证书
    pos:"",
    opp:"",
    cer:""
  },
  //加载显示
  onShow: function() {
    this.getCondition();
  },
  //获取申请信息
  getCondition: function() {
    var that = this;
    var url = "/UCenter/GetUserAuthenticationInfo";
    var requestData = {};
    util.netRequest(url, requestData, function(data) {
      if (data.Code == "100") {
        that.setData({
          authenWorkCount: data.Data.AuthenWorkCount,
          authenRecommendCount: data.Data.AuthenRecommendCount,
          authenPromotionCount: data.Data.AuthenPromotionCount,
          userWorkCount: data.Data.UserWorkCount,
          userRecommendCount: data.Data.UserRecommendCount,
          userPromotionCount: data.Data.UserPromotionCount,
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
  //提交审核
  formSubmit: function(e) {
    var that = this;
    var realName = e.detail.value.realName;
    var IDCard = e.detail.value.IDCard;
    var mobile = e.detail.value.mobile;
    var url = "/UCenter/ApplicationCertification";
    var requestData = ({
      "RealName": realName,
      "IdCardNumber": IDCard,
      "Mobile": mobile,
      "IdCardFrontal": that.data.pos,
      "IdCardRear": that.data.opp,
      "Evidence": that.data.cer
    })
    if (realName == "" || realName == null) {
      that.show("提示", "请输入真实姓名");
      return false;
    }
    if (IDCard == "" || IDCard == null) {
      that.show("提示", "请输入身份证号码");
      return false;
    }
    if (mobile == "" || mobile == null) {
      that.show("提示", "请输入手机号码");
      return false;
    }
    if (that.data.posImg == "" || that.data.posImg == null) {
      that.show("提示", "请上传身份证正面");
      return false;
    }
    if (that.data.oppImg == "" || that.data.oppImg == null) {
      that.show("提示", "请上传身份证反面");
      return false;
    } 
    if (that.data.certificate == "" || that.data.certificate == null) {
      that.show("提示", "请上传证书、资历证明");
      return false;
    }
    console.log("申请:realName-" + realName + ",IDCard-" + IDCard + ",mobile-" + mobile);
    util.netRequest(url, requestData, function(data) {
      if (data.Code == 100) {
        that.setData({

        });
        wx.switchTab({
          url: '/pages/member/member'
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
  //上传身份证正面
  uploadPositive() {
    console.log("上传身份证正面");
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        //請求頭部
        var header = util.getRequestHeader("/UCenter/UploadUserAuthenticationImg");
        //图片上传到服务器
        wx.uploadFile({
          url: app.globalData.apiSever + '/UCenter/UploadUserAuthenticationImg',
          filePath: tempFilePaths[0],
          name: 'file',
          header: header,
          success: function(res) {
            var data = res.data
            console.log(res)
            that.setData({   
              pos: JSON.parse(res.data).Data.Url,
              posImg: JSON.parse(res.data).Data.FullUrl
            })
          }
        })
      }
    });
  },
  //  上传身份证反面
  uploadOpposite: function(e) {
    console.log("上传身份证反面");
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths //临时图片路径
        console.log(tempFilePaths)
        //请求头部
        var header = util.getRequestHeader("/UCenter/UploadUserAuthenticationImg");
        wx.uploadFile({
          url: app.globalData.apiSever + '/UCenter/UploadUserAuthenticationImg',
          filePath: tempFilePaths[0],
          name: 'file',
          header: header,
          success: function(res) {
            var data = res.data;
            that.setData({
              opp: JSON.parse(res.data).Data.Url,
              oppImg: JSON.parse(res.data).Data.FullUrl
            })
          }
        })
      }
    });
  },
  //  上传证书、资历证明
  uploadCertificate: function(e) {
    console.log("上传证书、资历证明");
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths //图片
        //请求头部
        var header = util.getRequestHeader("/UCenter/UploadUserAuthenticationImg");
        wx.uploadFile({
          url: app.globalData.apiSever + '/UCenter/UploadUserAuthenticationImg',
          filePath: tempFilePaths[0],
          name: 'file',
          header: header,
          success: function(res) {
            var data = res.data;
            console.log(data);
            that.setData({
              cer: JSON.parse(res.data).Data.Url,
              certificate: JSON.parse(res.data).Data.FullUrl
            })
          }
        })
      }
    });
  },
  // 提示窗
  show: function(title, content) {
    wx.showModal({
      title: title,
      content: content,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})