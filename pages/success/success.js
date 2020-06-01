Page({

  /**
   * 页面的初始数据
   */
  data: {

    //默认地址下标
    index: 0,
    positionArray: ['麓谷企业广场', '河西王府井'],
    lastcont: 0,
    //购物车货品
    carArray: [],
    // 总商品数
    totalCount: 0,
    // 总价格 
    totalPrice: 0,
    baseImgurl: getApp().globalData.imageUrl, //获取图片接口
    morder: {},
    // 积分抵现
    checked: 'true',
    discount:0,
    //实际支付金额
    payMoney:0,
    paytime:"",
    ordno:"",
    paystat:"",
    cooupDiscont:'',

  },
  //绑定地点
  bindPositionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //跳转首页
  pay() {
    var that = this;
    that.setData({ lastcont: getApp().globalData.lastcont });
    wx.switchTab({
      url: '../home/home'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.ordno) {
      wx.request({
        url: getApp().globalData.morderByOrNoMsgUrl,
        data: { ordno: options.ordno},
        method: "post",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data);
          var datamsg = res.data;
          if (datamsg.code==0){
            that.setData({ payMoney: datamsg.payMoney,
              paytime: datamsg.paytime, ordno: datamsg.ordno, paystat: datamsg.paystat});
          }else{
            that.setData({
              paystat: datamsg.paystat});
          }
        }
      });
      
    }
     
    that.setData({ discount: getApp().globalData.discount });
    that.setData({ cooupDiscont: getApp().globalData.cooupDiscont});
    
    that.setData({ carArray: getApp().globalData.carArray });
    that.setData({ totalCount: getApp().globalData.totalCount });
    that.setData({ totalPrice: getApp().globalData.totalPrice });
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

  }

})