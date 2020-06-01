// pages/shopAddress/shopAddress.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:0,
    latitude:0,
    point:[],
    shopInfo:{}
  },
  getShopInfo(){//获取商户信息
    app.getLocation().then((res)=>{
      this.setData({
        longitude:res.longitude,
        latitude:res.latitude
      },()=>{
        app.toRequest('/shop/shopInfo/getShopInfoToCustomer',{
          "data": {
            "shopId": app.globalData.shopId,
            "longitude": this.data.longitude,
            "latitude": this.data.latitude
          },
        }).then(res=>{
          if(res.data.resultCode == 1){
            this.setData({
              shopInfo:res.data.data
            })
          }
        })
      })
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      point : [{latitude:options.latitude,longitude:options.longitude,title:options.shopName}]
    },()=>{
      this.getShopInfo()
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