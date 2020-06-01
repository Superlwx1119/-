let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['待使用','已失效'],
    activeTab: 0,
    height:app.globalData.swiperHeight,
    currentList:[],
    failList:[]
  },
  getCoupon(e){//领取优惠券
    wx.switchTab({
      url: '../home/home',
    })
    return
    let couponId = e.currentTarget.dataset.couponid
    let that = this ;
    wx.getStorage({
      key: 'customerId',
      success (res) {
        wx.request({
          url: app.globalData.urlPath+'/activity/couponCustomer/couponReceive',
          method:"POST",
          data:{
            data:{
              "customerId": res.data,
              "couponId": couponId,
            }
          },
          success:res=>{
            if(res.data.resultCode == 1){
              wx.showToast({
                title: '领取成功!',
                icon:'success',
                duration:1500
              })
              that.getCouponList()
            }else{
              wx.showToast({
                title: res.data.resultInfo,
                icon:'none',
                duration:1500
              })
            }
          }
        })
      }
    })
  },
  getCouponList(){//获取卡券列表
    let that = this ;
    wx.getStorage({
      key: 'customerId',
      success:res=>{
        app.toRequest('/activity/couponCustomer/couponCustomerList',{
          "data": {
            "customerId": res.data,
            "couponCustomerStatus": this.data.activeTab == 0 ?  0 : 1 ,
            "shopId": app.globalData.shopId
          },
          "pageSize":1000
        }).then(res=>{
          res.data.data.list.forEach(item => {
            item.endTime = item.endTime.substring(0,10)
            item.startTime = item.startTime.substring(0,10)
          });
          if(this.data.activeTab == 0){
            this.setData({
              currentList : res.data.data.list
            })
          }else{
            this.setData({
              failList : res.data.data.list
            })
          }
        })
        // wx.request({
        //   url: app.globalData.urlPath + '/activity/couponCustomer/couponCustomerList',
        //   method : 'POST' ,
        //   data:{
        //     "data": {
        //       "customerId": res.data,
        //       "couponCustomerStatus": this.data.activeTab == 0 ?  0 : 1 ,
        //       "shopId": app.globalData.shopId
        //     },
        //     "pageSize":1000
        //   },
        //   success:res=>{
        //     res.data.data.list.forEach(item => {
        //       item.endTime = item.endTime.substring(0,10)
        //       item.startTime = item.startTime.substring(0,10)
        //     });
        //     if(this.data.activeTab == 0){
        //       this.setData({
        //         currentList : res.data.data.list
        //       })
        //     }else{
        //       this.setData({
        //         failList : res.data.data.list
        //       })
        //     }
            
        //   }
        // })
      }
    })
    
  },
  getHeight(){
    //选择id
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('.weui-tabs').boundingClientRect(function (rect) {
      console.log(rect)
    })
    query.select('.current').boundingClientRect(function (rect) {
      that.setData({
        height: rect.top
      })
    }).exec();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onTabCLick(e) {
    const index = e.detail.index
    this.setData({activeTab: index},()=>{
      this.getCouponList()
    })
  },

  onChange(e) {
    const index = e.detail.index
    this.setData({activeTab: index})
  },
  
  onLoad: function (options) {
    const titles = ['待使用','已失效']
    const tabs = titles.map(item => ({title: item}))
    this.setData({tabs})
    this.getHeight()
    this.getCouponList()
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