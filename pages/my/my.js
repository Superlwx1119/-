let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    top:app.globalData.top,
    //默认地址下标
    index: 0,
    //地点选择
    positionArray: [],
    lastcont:0,
    points:0,
    touxiang:'',
    nickName:''
  },
  toOrder(e){//订单页
    let type = e.currentTarget.dataset.type
    if(type == 'history'){
      app.globalData.orderActive = 1
    }else{
      app.globalData.orderActive = 0
    }
    wx.switchTab({
      url: '../order/order',
    })
  },
  toQualification(){//查资质
    wx.navigateTo({
      url: '../shopQualification/shopQualification',
    })
  },
  toRefund(){//去退款
    wx.navigateTo({
      url: '../myRefund/myRefund',
    })
  },
  toComment(){//去评论
    wx.navigateTo({
      url: '../myComments/myComments',
    })
  },
  toCoupon(){//优惠卡券
    wx.navigateTo({
      url: '../myCoupon/myCoupon',
    })
  },
  //绑定地点
  bindPositionChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    //console.log('picker发送选择改变，携带值为', e.detail)
    var that = this;
    that.setData({
      index: e.detail.value
    });
    getApp().globalData.lastcontName = getApp().globalData.containerList[e.detail.value].name;//获得当前选中货柜名称
    var id = getApp().globalData.containerList[e.detail.value].id;
    wx.request({
      url: getApp().globalData.joinContainerUrl,
      data: {
        openid: getApp().globalData.openid,
        lastcont: id
      },
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          lastcont: id
        });
        getApp().globalData.lastcont = id;
        getApp().globalData.userInfo.lastcont = id;
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  toAddress(){//我的地址
    wx.navigateTo({
      url: '../address/address',
    })
  },
  noEffect: function () {
    wx.showToast({
      title: '该功能暂未开放',
      icon: 'none'
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
    if(wx.getStorageSync('openid')){
      this.setData({
        touxiang:app.globalData.userInfo.avatarUrl,
        nickName:app.globalData.userInfo.nickName
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请登录!',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login',
            })
          } else if (res.cancel) {
            wx.switchTab({
              url: '../home/home',
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
			title: app.globalData.shopName, //转发title
			path: "/pages/home/home", //相对的路径
			imageUrl: app.globalData.shopImage //分享图片
		}
  }
})