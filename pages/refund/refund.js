// pages/refund/refund.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    orderId:'',
    applyMoneyRes:[],
    applyMoney:0,
    showType:false,
    showReason:false,
    reasonList:[],
    reasonIndex:null,
    reasonId:'',
    reasonText:'请选择',
    typeText:'',
    typeValue:'',
    typeGroups:[
      { text: '仅退款', value: 20 },
      { text: '退货退款', value: 10 },
    ],
    sendValue : '' ,
    typeSend :[
      { text: '商家自取', value: 10 },
      { text: '买家自送', value: 20 },
    ],
    note:'',
    fileList:[],
    imageList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  deleteImg(e){//删除图片
    let index = e.currentTarget.dataset.index
    let fileList = this.data.fileList
    let imageList = this.data.imageList
    fileList.splice(index,1)
    imageList.splice(index,1)
    this.setData({
      fileList : fileList,
      imageList : imageList
    })
  },
  selectPhoto(){//选择照片
    let arr = this.data.fileList
    let imageList =this.data.imageList
    let that = this;
    wx.chooseImage({
      count:5,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) =>{
        
        res.tempFilePaths.forEach(item=>{
          wx.showLoading({
            title: '上传中...',
            icon: 'loading',
            duration: 15000
          });
          wx.uploadFile({ 
						url: app.globalData.urlPath + '/file/file/upload',
						filePath: item, 
						name: 'file',
						formData: {
							'user': item
						}, 
						success: function (res) {
              res.data = JSON.parse(res.data)
              // imageList.push(res.data.data[0])
              if(res.data.success){
                imageList.push(res.data.data[0])
                arr.push(item)
                that.setData({
                  fileList:arr,
                  imageList: imageList
                })
              }else{
                wx.showToast({
                  title: '上传失败!',
                  icon:'none',
                  duration : 1500
                })
              }
              wx.hideLoading();
						}
					});
        })
      },
    })
  },
  selectReason(e){//选择退款原因
    let index = e.currentTarget.dataset.index
    this.setData({
      reasonIndex : index ,
      showReason : false ,
      reasonId : this.data.reasonList[index].dictId,
      reasonText : this.data.reasonList[index].dictValue
    })
  },
  showReason(){
    this.setData({
      showReason : true
    })
  },
  selectSend(e){//选择退货方式
    let index = e.currentTarget.dataset.index
    this.setData({
      sendValue : this.data.typeSend[index].value
    })
  },
  inputNote(e){
    this.setData({
      note : e.detail.value
    })
  },
  typeClick(e){//选择退货类型
    let typeValue = ''
    let typeText = ''
    if(e){
      typeValue = e.detail.value
      this.data.typeGroups.forEach(item=>{
        if(typeValue == item.value){
          typeText = item.text
        }
      })
    }
    this.setData({
      showType : false ,
      typeValue : typeValue,
      typeText : typeText
    })
  },
  showType(){
    this.setData({
      showType : true
    })
  },
  reduction(e){//减少退款数量
    let index = e.currentTarget.dataset.index
    let applyMoneyRes = this.data.applyMoneyRes
    if(applyMoneyRes[index].refundsNumber <=1){
      applyMoneyRes[index].refundsNumber = 1
    }else{
      applyMoneyRes[index].refundsNumber--
    }
    this.getApplyMoney(applyMoneyRes)
    this.setData({
      applyMoneyRes : applyMoneyRes
    })
  },
  add(e){//加
    let index = e.currentTarget.dataset.index
    let able = e.currentTarget.dataset.able
    let applyMoneyRes = this.data.applyMoneyRes
    if(applyMoneyRes[index].refundsNumber >= able){
      wx.showToast({
        title: '超出最大可退款数量',
        icon:'none',
        duration:1500
      })
      return
    }else{
      applyMoneyRes[index].refundsNumber++
    }
    this.getApplyMoney(applyMoneyRes)
    this.setData({
      applyMoneyRes : applyMoneyRes
    })
  },
  getApplyMoney(applyMoneyRes){//退款单详情
    wx.showLoading({
      title: '加载中...',
      icon:'loading',
      duration :15000
    })
    let toRefundList = app.globalData.toRefundList
    if(applyMoneyRes){
      toRefundList = applyMoneyRes
    }else{
      toRefundList = app.globalData.toRefundList
    }
    app.toRequest('/refunds/refundsGoods/getApplyMoney',{
      "data": {
        "orderId": this.data.orderId,
        "refundsGoods": toRefundList
      },
    }).then(res=>{
      wx.hideLoading()
        this.setData({
          applyMoneyRes : res.data.data.applyMoneyRes,
          applyMoney : res.data.data.applyMoney
        })
    })
    // wx.request({
    //   url: app.globalData.urlPath + '/refunds/refundsGoods/getApplyMoney',
    //   method:'POST',
    //   data:{
    //     "data": {
    //       "orderId": this.data.orderId,
    //       "refundsGoods": toRefundList
    //     },
    //   },
    //   success:res=>{
    //     wx.hideLoading()
    //     this.setData({
    //       applyMoneyRes : res.data.data.applyMoneyRes,
    //       applyMoney : res.data.data.applyMoney
    //     })
    //   }
    // })
  },
  // getRefundInfo(){
  //   wx.showLoading({
  //     title: '加载中...',
  //     icon:'loading',
  //     duration :15000
  //   })
  //   app.toRequest('/refunds/refundsInfo/gerDetailsResToCus',{
  //     data:{
  //       refundsId :this.data.orderId
  //     }
  //   }).then(res=>{

  //   })
  //   wx.request({
  //     url: app.globalData.urlPath + '/refunds/refundsInfo/gerDetailsResToCus',
  //     method:'POST',
  //     data:{
  //       data:{
  //         refundsId :this.data.orderId
  //       }
  //     },
  //     success:res=>{
  //       wx.hideLoading()
  //     }
  //   })
  // },
  applyRefunds(){//提交退货退款
    if(this.data.typeValue == ''){
      wx.showToast({
        title: '请选择退款类型',
        icon:'none',
        duration:1500
      })
      return
    }
    if(this.data.reasonId == ''){
      wx.showToast({
        title: '请选择退款原因',
        icon:'none',
        duration:1500
      })
      return
    }
    let that = this ;
    let toRefundList = this.data.applyMoneyRes
    wx.showLoading({
      title: '加载中...',
      icon:'loading',
      duration :15000
    })
    wx.getStorage({
      key: 'customerId',
      success:res=>{
        app.toRequest('/refunds/refundsGoods/applyRefunds',{
          "data": {
            "orderId": that.data.orderId,
            "refundsGoods": toRefundList,
            "refundsType": that.data.typeValue,
            "backType" : that.data.sendValue,
            "reason" : that.data.reasonId,
            "explains" : that.data.note,
            "imagePath" : that.data.imageList.toString(),
            "shopId" : app.globalData.shopId,
            "customerId" : res.data
          },
        }).then(res=>{
          wx.hideLoading()
          wx.showToast({
            title: '提交成功!',
            duration: 1500
          })
          wx.redirectTo({
            url: '../waitRefunds/waitRefunds?type=' + that.data.typeValue + '&refundsId=' + res.data.data.refundsId,
          })
        })
        // wx.request({
        //   url: app.globalData.urlPath + '/refunds/refundsGoods/applyRefunds',
        //   method:'POST',
        //   data:{
        //     "data": {
        //       "orderId": that.data.orderId,
        //       "refundsGoods": toRefundList,
        //       "refundsType": that.data.typeValue,
        //       "backType" : that.data.sendValue,
        //       "reason" : that.data.reasonId,
        //       "explains" : that.data.note,
        //       "imagePath" : that.data.imageList.toString(),
        //       "shopId" : app.globalData.shopId,
        //       "customerId" : res.data
        //     },
        //   },
        //   success:res=>{
        //     wx.hideLoading()
        //     wx.showToast({
        //       title: '提交成功!',
        //       duration: 1500
        //     })
        //     wx.redirectTo({
        //       url: '../waitRefunds/waitRefunds?type=' + that.data.typeValue + '&refundsId=' + res.data.data.refundsId,
        //     })
        //   }
        // })
      }
    })
  },
  getReasonList(){//退款原因字典
    app.toRequest('/system/dictInfo/getDictList',{data:{dictType:'REFUNDS_REASON'}}).then(res=>{
      this.setData({
        reasonList : res.data.data
      })
    })
    // wx.request({
    //   url: app.globalData.urlPath + '/system/dictInfo/getDictList',
    //   method:'POST',
    //   data:{data:{dictType:'REFUNDS_REASON'}},
    //   success:res=>{
    //     this.setData({
    //       reasonList : res.data.data
    //     })
    //   }
    // })
  },
  showBigImg(e){//放大图片
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.fileList[index], // 当前显示图片的http链接
      urls: this.data.fileList // 需要预览的图片http链接列表
    })
  },
  onLoad: function (options) {
    this.getReasonList()
    wx.getSystemInfo({
      success: (res)=>{
        this.setData({
          windowHeight: res.windowHeight,
          orderId : options.orderId
        },()=>{
            this.getApplyMoney()
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