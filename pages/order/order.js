let app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top:app.globalData.top,
    tabs: ['当前订单','历史订单'],
    activeTab: 0,
    height:app.globalData.swiperHeight,
    currentList:[],
    historyList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  toDetail(e){//订单详情
    let orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderId='+orderId,
    })
  },
  toComments(e){//去评论
    let orderId = e.currentTarget.dataset.orderid
    let reviewId = e.currentTarget.dataset.reviewid
    if(reviewId){
      wx.navigateTo({
        url: '../comments/comments?orderId='+orderId+'&reviewId='+reviewId,
      })
    }else{
      wx.navigateTo({
        url: '../comments/comments?orderId='+orderId,
      })
    }
    
  },
  toRefund(e){//去退款
    let orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../refundList/refundList?orderId='+orderId,
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
  onTabCLick(e) {
    const index = e.detail.index
    app.globalData.orderActive = index
    this.setData({activeTab: index},()=>{this.getOrderList()})
  },

  onChange(e) {
    const index = e.detail.index
    this.setData({activeTab: index})
  },
  toPay(e){
    let orderId = e.currentTarget.dataset.orderid
    app.toRequest('/order/orderInfo/payOrder',{
      data:{
        orderId:orderId
      }
    }).then(res=>{
      wx.requestPayment({
        timeStamp: res.data.data.timeStamp,
        nonceStr: res.data.data.nonceStr,
        package: res.data.data.packages,
        signType: res.data.data.signType,
        paySign: res.data.data.paySign,
        success (res) {
          this.getOrderList()
        },
        fail (res) { }
      })
    })

    // wx.request({
    //   url: app.globalData.urlPath+'/order/orderInfo/payOrder',
    //   method:'POST',
    //   data:{
    //     data:{
    //       orderId:orderId
    //     }
    //   },
    //   success:res=>{
    //     wx.requestPayment({
    //       timeStamp: res.data.data.timeStamp,
    //       nonceStr: res.data.data.nonceStr,
    //       package: res.data.data.packages,
    //       signType: res.data.data.signType,
    //       paySign: res.data.data.paySign,
    //       success (res) {
    //         this.getOrderList()
    //       },
    //       fail (res) { }
    //     })
    //   }
    // })
  },
  getOrderList(){//订单列表
    let that = this ;
    wx.showLoading({
      title: '加载中',
      icon:'loading',
      duration : 10000
    })
    wx.getStorage({
      key: 'customerId',
      success:res=>{
        app.toRequest('/order/orderInfo/listOfCustomer',{
          data:{
            "customerId": res.data,
            "shopId": app.globalData.shopId,
            "customerStatus":that.data.activeTab == 0 ? 10 : 20 
          }
          
        }).then(res=>{
          if(res.data.resultCode == 1){
            if(that.data.activeTab == 0){
              that.setData({
                currentList : res.data.data.list
              })
            }else{
              that.setData({
                historyList : res.data.data.list
              })
            }
            
          }
          wx.hideLoading();
        })
        // wx.request({
        //   url: app.globalData.urlPath+'/order/orderInfo/listOfCustomer',
        //   method:'POST',
        //   data:{
        //     data:{
        //       "customerId": res.data,
        //       "shopId": app.globalData.shopId,
        //       "customerStatus":that.data.activeTab == 0 ? 10 : 20 
        //     }
            
        //   },
        //   success:res=>{
        //     if(res.data.resultCode == 1){
        //       if(that.data.activeTab == 0){
        //         that.setData({
        //           currentList : res.data.data.list
        //         })
        //       }else{
        //         that.setData({
        //           historyList : res.data.data.list
        //         })
        //       }
              
        //     }
        //     wx.hideLoading();

        //   }
        // })
      }
    })
    
  },
  onLoad: function (options) {
    
    const titles = ['当前订单','历史订单']
    const tabs = titles.map(item => ({title: item}))
    this.setData({tabs})
    // this.getHeight()
    
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
    // wx.showLoading({
    //   title: '加载中',
    // })
    // var that = this;
    // that.getgetAllMorderList();
    if(wx.getStorageSync('openid')){
      if(app.globalData.orderActive == 1){
        this.setData({
          activeTab : 1
        },()=>{
          this.getOrderList()
        })
      }else{
        this.setData({
          activeTab : 0
        },()=>{
          this.getOrderList()
        })
      }
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