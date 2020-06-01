let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    liceseList:[],
    listRow:0,
    shopImage:[],
    shopInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLicense()
    wx.getSystemInfo({
      success: (res)=>{
        this.setData({
          windowHeight: res.windowHeight,
        });
      }
    });
  },
  getLicense(){//商户资质
    app.toRequest('/shop/shopInfo/getShopLicenseToCustomer',{data:{shopId:app.globalData.shopId}}).then(res=>{
      const liceseList = []
      JSON.parse(res.data.data.licenseImage).forEach((item, index) => {
        const rows = Math.floor(index / 2)
        if (!liceseList[rows]) {
          liceseList[rows] = []
        }
        liceseList[rows].push(item)
      })
      const shopImage = []
      JSON.parse(res.data.data.shopImage).forEach((item, index) => {
        const rows = Math.floor(index / 2)
        if (!shopImage[rows]) {
          shopImage[rows] = []
        }
        shopImage[rows].push(item)
      })

      this.setData({
        liceseList : liceseList ,
        shopImage : shopImage,
        shopInfo : res.data.data
      })
    })
    // wx.request({
    //   url: app.globalData.urlPath+'/shop/shopInfo/getShopLicenseToCustomer',
    //   method:'POST',
    //   data:{data:{shopId:app.globalData.shopId}},
    //   success:res=>{
    //     const liceseList = []
    //     JSON.parse(res.data.data.licenseImage).forEach((item, index) => {
    //       const rows = Math.floor(index / 2)
    //       if (!liceseList[rows]) {
    //         liceseList[rows] = []
    //       }
    //       liceseList[rows].push(item)
    //     })
    //     const shopImage = []
    //     JSON.parse(res.data.data.shopImage).forEach((item, index) => {
    //       const rows = Math.floor(index / 2)
    //       if (!shopImage[rows]) {
    //         shopImage[rows] = []
    //       }
    //       shopImage[rows].push(item)
    //     })

    //     this.setData({
    //       liceseList : liceseList ,
    //       shopImage : shopImage,
    //       shopInfo : res.data.data
    //     })
    //   }
    // })
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