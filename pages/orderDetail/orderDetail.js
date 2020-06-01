let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    orderId:'',
    orderInfo:{},
    down:false,
  },
  showAll(){
    this.setData({
      down : true
    })
  },
  setTimeout(orderInfo){
    let timer = null
    timer = setTimeout(()=>{
      if(orderInfo.remainTime == 0){
        clearTimeout(timer)
        return
      }
      orderInfo.remainTime --
      this.setData({
        orderInfo : orderInfo
      })
    },60000)
  },
  getOrderInfo(){//订单详情
    app.toRequest('/order/orderInfo/get',{
      data:{
        orderId:this.data.orderId
      }
    }).then(res=>{
      var date1= res.data.data.insTime;  //开始时间  
      var date2 = new Date();    //结束时间  
      var date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数        
      //计算出相差天数  
      var days=Math.floor(date3/(24*3600*1000))  
      //计算出小时数  
      var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数  
      var hours=Math.floor(leave1/(3600*1000))  
      //计算相差分钟数  
      var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数  
      var minutes=Math.floor(leave2/(60*1000))
      
      if(hours>=1 || days>=0){
        res.data.data.timeUp = 0
      }
      this.setData({
        orderInfo : res.data.data
      },()=>{
        this.setTimeout(res.data.data)
      })
    })
    // wx.request({
    //   url: app.globalData.urlPath+'/order/orderInfo/get',
    //   method:'POST',
    //   data:{
    //     data:{
    //       orderId:this.data.orderId
    //     }
    //   },
    //   success:res=>{
    //     var date1= res.data.data.insTime;  //开始时间  
    //     var date2 = new Date();    //结束时间  
    //     var date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数        
    //     //计算出相差天数  
    //     var days=Math.floor(date3/(24*3600*1000))  
    //     //计算出小时数  
    //     var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数  
    //     var hours=Math.floor(leave1/(3600*1000))  
    //     //计算相差分钟数  
    //     var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数  
    //     var minutes=Math.floor(leave2/(60*1000))
        
    //     if(hours>=1 || days>=0){
    //       res.data.data.timeUp = 0
    //     }
    //     this.setData({
    //       orderInfo : res.data.data
    //     },()=>{
    //       this.setTimeout(res.data.data)
    //     })
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.getSystemInfo({
      success: (res)=>{
        this.setData({
          windowHeight: res.windowHeight,
          orderId : options.orderId
        },()=>{
          this.getOrderInfo()
        });
      }
    });
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