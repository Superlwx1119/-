// pages/address/address.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top:app.globalData.top,
    addressList:[],
    type:'edit'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type
    if(type){
      this.setData({
        type : type
      })
    }
  },
  selectAddress(e){
    app.globalData.addressItem = e.currentTarget.dataset.item
    wx.navigateBack({
      delta: 1
    })
  },
  add(){
    wx.navigateTo({
      url: '../addAddress/addAddress',
    })
  },
  editAddress(e){//编辑地址
    let addressId = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    app.globalData.addressId = addressId
    app.globalData.addressIndex = index
    wx.navigateTo({
      url: '../editAddress/editAddress',
    })
  },
  getAddressList(){//地址列表
    let that = this;
    wx.showLoading({
      title: '加载中...',
      icon: 'loading',
      duration: 15000
    });
    wx.getStorage({
      key: 'customerId',
      success (res) {
        app.toRequest('/customer/customerAddress/getAddressList',{data:{customerId:res.data}}).then(res=>{
          wx.hideLoading()
            if(res.data.resultCode==1){
              that.setData({
                addressList : res.data.data.list
              })
            }
        })
        // wx.request({
        //   url: app.globalData.urlPath+'/customer/customerAddress/getAddressList',
        //   method:'POST',
        //   data:{data:{customerId:res.data}},
        //   success:res=>{
        //     wx.hideLoading()
        //     if(res.data.resultCode==1){
        //       that.setData({
        //         addressList : res.data.data.list
        //       })
        //     }
        //   }
        // })
      }
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
    this.getAddressList()
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