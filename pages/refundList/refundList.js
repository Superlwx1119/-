let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    currentIndex:'',
    selectAll:false,
    orderId:'',
    selectCount : 0
  },
  toRefund(){//确定去退款
    let goodsList = this.data.goodsList
    let toRefundList = []
    goodsList.forEach(item=>{
      if(item.selected){
        let json = {
          orderGoodsId : item.orderGoodsId,
          refundsNumber : item.refundableNum
        }
        toRefundList.push(json)
      }
    })
    app.globalData.toRefundList = toRefundList
    wx.navigateTo({
      url: '../refund/refund?orderId='+this.data.orderId,
    })
  },
  selectAll(){//全选
    let goodsList = this.data.goodsList
    if(this.data.selectAll){
      goodsList.forEach(item=>{
        item.selected = false
      })
      this.setData({
        selectAll : false,
        goodsList :goodsList
      })
    }else{
      goodsList.forEach(item=>{
        item.selected = true
      })
      this.setData({
        selectAll : true,
        goodsList :goodsList

      })
    }
  },
  selectGoods(e){
    let currentIndex = e.currentTarget.dataset.index
    let goodsList = this.data.goodsList
    let selectCount = this.data.selectCount
    let selectAll = false 
    goodsList.forEach((item,index)=>{
      if(index == currentIndex && item.selected ){
        item.selected = false
        this.setData({
          selectAll : false
        })
        return
      }
      if(index == currentIndex){
        this.setData({
          selectCount : selectCount + 1
        },()=>{
          if(goodsList.length == this.data.selectCount){
            this.setData({
              selectAll : true
            })
          }
        })
        item.selected = true
      }
    })
    this.setData({
      currentIndex:currentIndex,
      goodsList : goodsList,
    })
  },
  handleContact(e){
    console.log(e.detail.path)
        console.log(e.detail.query)
  },
  getGoodsList(orderId){//可选择商品列表
    wx.showLoading({
      title:'加载中...',
      icon:'loading',
      duration:15000
    })
    app.toRequest('/refunds/refundsGoods/getRefundableList',{data:{orderId:orderId}}).then(res=>{
      wx.hideLoading()
        if(res.data.resultCode == 1){
          this.setData({
            goodsList : res.data.data.list
          })
        }
    })
    // wx.request({
    //   url: app.globalData.urlPath + '/refunds/refundsGoods/getRefundableList',
    //   method:'POST',
    //   data:{data:{orderId:orderId}},
    //   success:res=>{
    //     wx.hideLoading()
    //     if(res.data.resultCode == 1){
    //       this.setData({
    //         goodsList : res.data.data.list
    //       })
    //     }
        
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = options.orderId
    this.setData(
      {orderId : orderId}
    )
    this.getGoodsList(orderId)
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