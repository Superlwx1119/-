let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    goodsLevel: 0,
    commentsList:[],
    ListTotal:0,
    mediumReview:0,
    badReview:0,
    goodReview:0,
    touxiang:''
,
  },
  deleteComment(e){
    let reviewId = e.currentTarget.dataset.reviewid
    app.toRequest('/review/reviewInfo/reviewAlterStatus',{
      "data": {
        "reviewId": reviewId,
        "status": 10
      },
    }).then(res=>{
      this.getCommentTypeNum()
      this.getCommentsList()
    })
    // wx.request({
    //   url: app.globalData.urlPath+'/review/reviewInfo/reviewAlterStatus',
    //   method:'POST',
    //   data:{
    //     "data": {
    //       "reviewId": reviewId,
    //       "status": 10
    //     },
    //   },
    //   success:res=>{
    //     this.getCommentTypeNum()
    //     this.getCommentsList()
    //   }
    // })
  },
  getCommentTypeNum(){//各级评价统计
    let that = this ;
    wx.getStorage({
      key: 'customerId',
      success:res=>{
        app.toRequest('/review/reviewInfo/reviewInfoCustomerStatistical',{
          "data": {
            "customerId": res.data,
            "shopId": app.globalData.shopId,
          },
        }).then(res=>{
          that.setData({
            badReview : res.data.data.badReview,
            goodReview: res.data.data.goodReview,
            mediumReview : res.data.data.mediumReview
          })
        })
        // wx.request({
        //   url: app.globalData.urlPath+'/review/reviewInfo/reviewInfoCustomerStatistical',
        //   method:'POST',
        //   data:{
        //     "data": {
        //       "customerId": res.data,
        //       "shopId": app.globalData.shopId,
        //     },
        //   },
        //   success:res=>{
        //     that.setData({
        //       badReview : res.data.data.badReview,
        //       goodReview: res.data.data.goodReview,
        //       mediumReview : res.data.data.mediumReview
        //     })
        //   }
        // })
      }
    })
  },
  getCommentsList(){
    let that = this ;
    wx.getStorage({
      key: 'customerId',
      success:res=>{
        app.toRequest('/review/reviewInfo/reviewInfoCustomerList',{
          "data": {
            "customerId": res.data,
            "goodsLevel": that.data.goodsLevel,
            "shopId": app.globalData.shopId,
          },
        }).then(res=>{
          res.data.data.list.forEach(item=>{
            switch (item.goodsLevel){
              case 50 : item.goodsLevelName = '好评';
              break;
              case 30 : item.goodsLevelName = '中评';
              break;
              case 10 : item.goodsLevelName = '差评';
              break;
            } 
          })
          // console.log(res.data.data.list.imagePath)
          res.data.data.list.forEach(item=>{
            item.imagePath = item.imagePath.split(',')[0]
          })
          that.setData({
            commentsList : res.data.data.list,
            ListTotal: res.data.data.total
          })
        })
        // wx.request({
        //   url: app.globalData.urlPath+'/review/reviewInfo/reviewInfoCustomerList',
        //   method:'POST',
        //   data:{
        //     "data": {
        //       "customerId": res.data,
        //       "goodsLevel": that.data.goodsLevel,
        //       "shopId": app.globalData.shopId,
        //     },
        //   },
        //   success:res=>{
        //     res.data.data.list.forEach(item=>{
        //       switch (item.goodsLevel){
        //         case 50 : item.goodsLevelName = '好评';
        //         break;
        //         case 30 : item.goodsLevelName = '中评';
        //         break;
        //         case 10 : item.goodsLevelName = '差评';
        //         break;
        //       } 
        //     })
        //     // console.log(res.data.data.list.imagePath)
        //     res.data.data.list.forEach(item=>{
        //       item.imagePath = item.imagePath.split(',')[0]
        //     })
        //     that.setData({
        //       commentsList : res.data.data.list,
        //       ListTotal: res.data.data.total
        //     })
        //   }
        // })
      }
    })
    
  },
  commentDetail(e){//评价详情
    let reviewId = e.currentTarget.dataset.reviewid
    let orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../comments/comments?reviewId='+reviewId+'&orderId='+orderId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCommentTypeNum()
    // this.getCommentsList()
    // wx.getSystemInfo({
    //   success: (res)=>{
    //     this.setData({
    //       windowHeight: res.windowHeight,
    //       touxiang:app.globalData.userInfo.avatarUrl
    //     });
    //   }
    // });
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
    this.getCommentTypeNum()
    this.getCommentsList()
    wx.getSystemInfo({
      success: (res)=>{
        this.setData({
          windowHeight: res.windowHeight,
          touxiang:app.globalData.userInfo.avatarUrl
        });
      }
    });
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