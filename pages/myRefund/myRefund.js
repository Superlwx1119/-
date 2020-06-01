let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['正在退款','历史退款'],
    activeTab: 0,
    height:app.globalData.swiperHeight,
    refundsList:[],
    top:app.globalData.top,
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
    app.globalData.refundActive = index
    this.setData({activeTab: index},()=>{this.getRefundList()})
  },
  refundDetail(e){
    let refundsId = e.currentTarget.dataset.refundsid
    let refundsType = e.currentTarget.dataset.refundsType
    wx.navigateTo({
      url: '../waitRefunds/waitRefunds?type=' + refundsType + '&refundsId=' + refundsId,
    })
  },
  getRefundList(){//退款售后列表
    let that = this ;
    wx.showLoading({
      title: '加载中...',
      icon:'loading',
      duration :15000
    })
    wx.getStorage({
      key: 'customerId',
      success:res=>{
        app.toRequest('/refunds/refundsInfo/getRefundsInfoToCus',{
          "data": {
            "customerId": res.data,
            "status": that.data.activeTab+1
          },
        }).then(res=>{
          wx.hideLoading()
          if(res.data.success){
            res.data.data.list.forEach(item=>{
              switch (item.status){
                case 0 :item.statusName = '已撤销';
                break;
                case 1000 :item.statusName = '已申请';
                break;
                case 1500 :item.statusName = '同意退货';
                break;
                case 2000 :item.statusName = '已拒绝';
                break;
                case 3000 :item.statusName = '已退款';
                break;
              }
            })
            that.setData({
              refundsList : res.data.data.list
            })
          }
        })
        // wx.request({
        //   url: app.globalData.urlPath + '/refunds/refundsInfo/getRefundsInfoToCus',
        //   method:'POST',
        //   data:{
        //     "data": {
        //       "customerId": res.data,
        //       "status": that.data.activeTab+1
        //     },
        //   },
        //   success:res=>{
        //     wx.hideLoading()
        //     if(res.data.success){
        //       res.data.data.list.forEach(item=>{
        //         switch (item.status){
        //           case 0 :item.statusName = '已撤销';
        //           break;
        //           case 1000 :item.statusName = '已申请';
        //           break;
        //           case 1500 :item.statusName = '同意退货';
        //           break;
        //           case 2000 :item.statusName = '已拒绝';
        //           break;
        //           case 3000 :item.statusName = '已退款';
        //           break;
        //         }
        //       })
        //       that.setData({
        //         refundsList : res.data.data.list
        //       })
        //     }
            
        //   }
        // })
      }
    })
  },
  onChange(e) {
    const index = e.detail.index
    this.setData({activeTab: index})
  },
  
  onLoad: function (options) {
    const titles = ['正在退款','历史退款']
    const tabs = titles.map(item => ({title: item}))
    this.setData({tabs})
    this.getHeight()
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
    if(app.globalData.refundActive == 1){
      this.setData({
        activeTab : 1
      },()=>{
        this.getRefundList()
      })
    }else{
      this.setData({
        activeTab : 0
      },()=>{
        this.getRefundList()
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