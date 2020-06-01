// pages/refund/refund.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refundsId:'',
    windowHeight:'',
    orderId:'',
    applyMoneyRes:[{imagePath:'../images/goods.png',refundsNumber:2,goodsName:'三生三世'},{imagePath:'../images/goods.png',refundsNumber:2,goodsName:'三生三世'}],
    applyMoney:0,
    showType:false,
    typeText:'',
    typeValue:'',
    typeGroups:[
      { text: '仅退货', value: 20 },
      { text: '退货退款', value: 10 },
    ],
    sendValue : '' ,
    typeSend :[
      { text: '商家自取', value: 10 },
      { text: '买家自送', value: 20 },
    ],
    note:'',
    fileList:[],
    imageList:[],
    refundDetail:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  cancelApply(){//撤销申请
    app.toRequest('/refunds/refundsInfo/cancelRefundsById',{
      "data": {
        "refundsId": this.data.refundsId,
      },
    }).then(res=>{
      if(res.data.resultCode == 1){
        wx.showToast({
          title: '操作成功!',
          duration : 1000
        },()=>{
          wx.redirectTo({
            url: '../myRefund/myRefund'
          })
        })
        
      }else{
        wx.showToast({
          title: res.data.resultInfo,
          icon:'none',
          duration : 1500
        })
      }
    })
    // wx.request({
    //   url: app.globalData.urlPath + '/refunds/refundsInfo/cancelRefundsById',
    //   method:'POST',
    //   data:{
    //     "data": {
    //       "refundsId": this.data.refundsId,
    //     },
    //   },
    //   success:res=>{
    //     if(res.data.resultCode == 1){
    //       wx.showToast({
    //         title: '操作成功!',
    //         duration : 1000
    //       },()=>{
    //         wx.redirectTo({
    //           url: '../myRefund/myRefund'
    //         })
    //       })
          
    //     }else{
    //       wx.showToast({
    //         title: res.data.resultInfo,
    //         icon:'none',
    //         duration : 1500
    //       })
    //     }
    //   }
    // })
  },
  selectPhoto(){//选择照片
    let arr = []
    let imageList =[]
    let that = this;
    wx.chooseImage({
      count:5,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) =>{
        wx.showLoading({
					title: '上传中...',
					icon: 'loading',
					duration: 15000
				});
        res.tempFilePaths.forEach(item=>{
          wx.uploadFile({ 
						url: app.globalData.urlPath + '/file/file/upload',
						filePath: item, 
						name: 'file',
						formData: {
							'user': item
						}, 
						success: function (res) {
              res.data = JSON.parse(res.data)
              imageList.push(res.data.data[0])
              wx.hideLoading();
						}
					});
          arr.push(item)
        })
        that.setData({
          fileList:arr,
          imageList: imageList
        })
      },
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
  getApplyMoney(applyMoneyRes){
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
    //     console.log(res)
    //     this.setData({
    //       applyMoneyRes : res.data.data.applyMoneyRes,
    //       applyMoney : res.data.data.applyMoney
    //     })
    //   }
    // })
  },
  getRefundInfo(refundsId){//退款单详情
    wx.showLoading({
      title: '加载中...',
      icon:'loading',
      duration :15000
    })
    app.toRequest('/refunds/refundsInfo/getDetailsResToCus',{
      data:{
        refundsId :refundsId
      }
    }).then(res=>{
      wx.hideLoading()
        if(res.data.success){
          res.data.data.imagePath = res.data.data.imagePath.split(',')
          this.setData({
            refundDetail : res.data.data
          })
        }else{
          wx.showToast({
            title: res.data.resultInfo,
            icon:'none',
            duration : 1500
          })
        }
    })
    // wx.request({
    //   url: app.globalData.urlPath + '/refunds/refundsInfo/getDetailsResToCus',
    //   method:'POST',
    //   data:{
    //     data:{
    //       refundsId :refundsId
    //     }
    //   },
    //   success:res=>{
    //     wx.hideLoading()
    //     if(res.data.success){
    //       res.data.data.imagePath = res.data.data.imagePath.split(',')
    //       this.setData({
    //         refundDetail : res.data.data
    //       })
    //     }else{
    //       wx.showToast({
    //         title: res.data.resultInfo,
    //         icon:'none',
    //         duration : 1500
    //       })
    //     }
    //   }
    // })
  },
  showBigImg(e){//放大图片
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      current: index, // 当前显示图片的http链接
      urls: this.data.refundDetail.imagePath // 需要预览的图片http链接列表
    })
  },
  applyRefunds(){//提交退货退款
    if(this.data.typeValue == ''){
      wx.showToast({
        title: '请选择退款类型',
        icon:'none',
        duration:1500
      })
      return
    }
    let that = this ;
    let toRefundList = this.data.applyMoneyRes
    wx.getStorage({
      key: 'customerId',
      success:res=>{
        app.toRequest('/refunds/refundsGoods/applyRefunds',{
          "data": {
            "orderId": that.data.orderId,
            "refundsGoods": toRefundList,
            "refundsType": that.data.typeValue,
            "backType" : that.data.sendValue,
            "reason" : '',
            "explains" : that.data.note,
            "imagePath" : that.data.imageList.toString(),
            "shopId" : app.globalData.shopId,
            "customerId" : res.data
          },
        }).then(res=>{
          if(res.data.resultCode == 1){
            that.getRefundInfo()
          }
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
        //       "reason" : '',
        //       "explains" : that.data.note,
        //       "imagePath" : that.data.imageList.toString(),
        //       "shopId" : app.globalData.shopId,
        //       "customerId" : res.data
        //     },
        //   },
        //   success:res=>{
        //     console.log(res.data)
        //     if(res.data.resultCode == 1){
        //       that.getRefundInfo()
        //       // wx.navigateTo({
        //       //   url: '../waitRefunds/waitRefunds?type+' + that.data.typeValue + '&refundsId=' + res.data.refundsId,
        //       // })
        //     }
        //   }
        // })
      }
    })
  },
  getDictList(){//退款理由字典

  },
  onLoad: function (options) {
    this.getRefundInfo(options.refundsId)
    wx.getSystemInfo({
      success: (res)=>{
        this.setData({
          windowHeight: res.windowHeight,
          orderId : options.orderId, 
          refundsId : options.refundsId
        },()=>{
            // this.getRefundInfo(refundsId)
            // this.getApplyMoney()
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
    wx.redirectTo({
      url: '../myRefund/myRefund'
    })
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