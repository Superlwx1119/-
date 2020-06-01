// pages/submitOrder/submitOrder.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopName:'',
    phone:'',
    top:app.globalData.top,
    show:false,
    currTag:'shop',
    othImg:'../images/motuo.svg',
    curImg:'../images/shop-active.svg',
    customerAddressId:'',
    note:'',
    address:{},
    orderInfo:{},
    couponList:[],
    couponCustomerId:'',
    currentCou: null,
    skuId:'',
    count:0,
    banBtn: false,
    msgOfCar:{}
  },
  bindKeyInput(e){
    let data = this.data
    let type = e.currentTarget.dataset.type
    let value = e.detail.value
    if(type == 'phone')app.globalData.phone = value
    data[type] = value
  },
  getList(){//地址列表
    wx.showLoading({
      title: '加载中...',
      icon: 'loading',
      duration: 15000
    });
    let that = this;
    if(app.globalData.addressItem.customerAddressId){
      that.setData({
        address : app.globalData.addressItem,
        phone:app.globalData.addressItem.phone
      },()=>{
        that.getOrderInfo()
      })
      return
    }
    wx.getStorage({
      key: 'customerId',
      success (res) {
        app.toRequest('/customer/customerAddress/getAddressList',{data:{customerId:res.data}}).then(res=>{
          if(res.data.resultCode==1){
            that.setData({
              address : res.data.data.list.length == 0 ? '' : res.data.data.list[0],
              phone: res.data.data.list.length == 0?  app.globalData.phone : res.data.data.list[0].phone
            },()=>{
              that.getOrderInfo()
            })
          }
        })
        // wx.request({
        //   url: app.globalData.urlPath+'/customer/customerAddress/getAddressList',
        //   method:'POST',
        //   data:{data:{customerId:res.data}},
        //   success:res=>{
        //     if(res.data.resultCode==1){
        //       that.setData({
        //         address : res.data.data.list.length == 0 ? '' : res.data.data.list[0],
        //         phone: res.data.data.list.length == 0?  app.globalData.phone : res.data.data.list[0].phone
        //       },()=>{
        //         that.getOrderInfo()
        //       })
        //     }
        //   }
        // })
      }
    })
  },
  getOrderInfo(){//订单详情
    let goodsInCar = app.globalData.goodsInCar
    let goodsTally = []
    let that = this ;
    if(!this.data.skuId){
      goodsInCar.forEach(item=>{
        let json = {
          buyNumber : item.count ,
          skuId : item.skuId
        }
        goodsTally.push(json)
      })
    }else{
      let json = {
        buyNumber :this.data.count ,
        skuId : this.data.skuId
      }
      goodsTally.push(json)
    }
    wx.getStorage({
      key: 'customerId',
      success:res=>{
        app.toRequest('/order/orderInfo/orderTally',{
          "data": {
            "couponCustomerId":  that.data.couponCustomerId,
            "customerAddressId": that.data.currTag == 'send' ? that.data.customerAddressId : that.data.address.customerAddressId, 
            "customerId": res.data,
            "distribution": that.data.currTag == 'send' ? 20 : 10,
            "goodsTally": goodsTally,
            "phone": that.data.address.phone,
            "shopId": app.globalData.shopId
          },
        }).then(res=>{
          wx.hideLoading()
            if(res.data.resultCode == 1){
              that.setData({
                orderInfo : res.data.data
              })
            }
        })
        // wx.request({
        //   url: app.globalData.urlPath + '/order/orderInfo/orderTally',
        //   method:'POST',
        //   data:{
        //     "data": {
        //       "couponCustomerId":  that.data.couponCustomerId,
        //       "customerAddressId": that.data.currTag == 'send' ? that.data.customerAddressId : that.data.address.customerAddressId, 
        //       "customerId": res.data,
        //       "distribution": that.data.currTag == 'send' ? 20 : 10,
        //       "goodsTally": goodsTally,
        //       "phone": that.data.address.phone,
        //       "shopId": app.globalData.shopId
        //     },
        //   },
        //   success:res=>{
        //     wx.hideLoading()
        //     if(res.data.resultCode == 1){
        //       that.setData({
        //         orderInfo : res.data.data
        //       })
        //     }
        //   }
        // })
      }
    })
    
  },
  selectType(e){//选择取货方式
    let curImg,othImg

    if(e.currentTarget.dataset.type == 'send'){
      othImg = '../images/motuo-active.svg'
      curImg = '../images/shop.svg'
    }else{
      curImg = '../images/shop-active.svg'
      othImg = '../images/motuo.svg'
    }
    this.setData({
      currTag:e.currentTarget.dataset.type,
      curImg:curImg,
      othImg:othImg
    },()=>{
      this.getOrderInfo()
    })
  },
  toPay(){
    if(this.data.msgOfCar.curPrice == 0){
      wx.showToast({
        title: '未选购商品!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.navigateTo({
      url: '../submitOrder/submitOrder',
    })
  },
  getGoodsInCar(e){//遍历购物车
    let goodsInCar = app.globalData.goodsInCar
    let msgOfCar = {}
    msgOfCar.curPrice = 0
    msgOfCar.befPrice = 0
    msgOfCar.count = 0
    
    goodsInCar.forEach(item=>{
      msgOfCar.count += item.count
      msgOfCar.curPrice += item.count*Number(item.actualPrice)
      msgOfCar.befPrice += item.count*Number(item.oldPrice)
    })
    msgOfCar.curPrice = Number(msgOfCar.curPrice).toFixed(2)
    msgOfCar.befPrice = Number(msgOfCar.befPrice).toFixed(2)
    this.setData({
      msgOfCar :msgOfCar
    })
    app.globalData.msgOfCar = msgOfCar
    app.globalData.goodsInCar = goodsInCar
  },
  submitOrder(){//提交订单
    if(this.data.banBtn)return
    if(this.data.orderInfo.scope == 20 && this.data.currTag == 'send'){
      wx.showToast({
        title: '超出配送范围,重新选择地址!',
        icon:"none",
        duration:1500
      })
      return
    }
    if(this.data.phone == '' && this.data.currTag == 'shop'){
      wx.showToast({
        title: '手机号不能为空!',
        icon:"none",
        duration:1500
      })
      return
    }
    if(!(/^1[3456789]\d{9}$/.test(this.data.phone)) && this.data.currTag == 'shop'){ 
        wx.showToast({
          title: '手机号码有误，请重填!',
          icon:'none',
          duration:2000
        }) 
        return false; 
    } 
    if(!this.data.address.address && this.data.currTag == 'send'){
      wx.showToast({
        title: '无收货地址,请添加!',
        icon:"none",
        duration:1500
      })
      return
    }
    this.setData({
      banBtn : true
    })
    let that = this ;
    let goodsInCar = app.globalData.goodsInCar
    let goodsTally = []
    goodsInCar.forEach(item=>{
      let json = {
        buyNumber : item.count ,
        skuId : item.skuId
      }
      goodsTally.push(json)
    })
    wx.getStorage({
      key: 'customerId',
      success:res=>{
        wx.showLoading({
          title: '加载中...',
          icon:'loading',
          duration : 15000
        })
        app.toRequest('/order/orderInfo/submitOrder',{
          "data": {
            "couponCustomerId":  that.data.couponCustomerId,
            "customerAddressId": that.data.address.customerAddressId,
            "customerId": res.data,
            "distribution": that.data.currTag == 'send' ? 20 : 10,
            "goodsTally": goodsTally,
            "phone": that.data.currTag == 'send'  ? that.data.address.phone : that.data.phone ,
            "shopId": app.globalData.shopId,
            "remark" : that.data.note
          },
        }).then(res=>{
          wx.hideLoading()
          if(res.data.resultCode == 1){
              if(res.data.data.timeStamp){
                wx.requestPayment({
                  timeStamp: res.data.data.timeStamp,
                  nonceStr: res.data.data.nonceStr,
                  package: res.data.data.packages,
                  signType: res.data.data.signType,
                  paySign: res.data.data.paySign,
                  complete (res) {
                    // goodsTally.forEach(item=>{
                    //   goodsInCar.forEach((v,index)=>{
                    //     if(v.skuId == item.skuId){
                    //       goodsInCar.splice(index,1)
                    //     }  
                    //   })
                    // })
                    // goodsInCar = []
                    app.globalData.goodsInCar = []
                    that.getGoodsInCar()
                    that.setData({banBtn:false})
                    wx.switchTab({
                      url: '../order/order',
                    })
                    
                  }
                })
              }else{
                wx.showToast({
                  title: '支付失败!稍候再试!',
                  icon:'none',
                  duration:1500,
                  success:()=>{
                    wx.switchTab({
                      url: '../order/order',
                    })
                  }
                })
                
              }
          }else{
            wx.showToast({
              title: res.data.data.resultInfo,
              icon:'none',
              duration:1500
            })
          }
        })
        // wx.request({
        //   url: app.globalData.urlPath + '/order/orderInfo/submitOrder',
        //   method:'POST',
        //   data:{
        //     "data": {
        //       "couponCustomerId":  that.data.couponCustomerId,
        //       "customerAddressId": that.data.address.customerAddressId,
        //       "customerId": res.data,
        //       "distribution": that.data.currTag == 'send' ? 20 : 10,
        //       "goodsTally": goodsTally,
        //       "phone": that.data.currTag == 'send'  ? that.data.address.phone : that.data.phone ,
        //       "shopId": app.globalData.shopId,
        //       "remark" : that.data.note
        //     },
        //   },
        //   success:res=>{
        //     wx.hideLoading()
        //     if(res.data.resultCode == 1){
        //         if(res.data.data.timeStamp){
        //           wx.requestPayment({
        //             timeStamp: res.data.data.timeStamp,
        //             nonceStr: res.data.data.nonceStr,
        //             package: res.data.data.packages,
        //             signType: res.data.data.signType,
        //             paySign: res.data.data.paySign,
        //             complete (res) {
        //               // goodsTally.forEach(item=>{
        //               //   goodsInCar.forEach((v,index)=>{
        //               //     if(v.skuId == item.skuId){
        //               //       goodsInCar.splice(index,1)
        //               //     }  
        //               //   })
        //               // })
        //               // goodsInCar = []
        //               app.globalData.goodsInCar = []
        //               that.getGoodsInCar()
        //               that.setData({banBtn:false})
        //               wx.switchTab({
        //                 url: '../order/order',
        //               })
                      
        //             }
        //           })
        //         }else{
        //           wx.showToast({
        //             title: '支付失败!稍候再试!',
        //             icon:'none',
        //             duration:1500,
        //             success:()=>{
        //               wx.switchTab({
        //                 url: '../order/order',
        //               })
        //             }
        //           })
                  
        //         }
        //     }else{
        //       wx.showToast({
        //         title: res.data.data.resultInfo,
        //         icon:'none',
        //         duration:1500
        //       })
        //     }
              
        //   }
        // })
      }
    })
    
    
  },
  cancelCou(e){//取消使用优惠券
    let index = e.currentTarget.dataset.index
    this.setData({
      couponCustomerId : '',
      show : false ,
      currentCou : null
    },()=>{
      this.getOrderInfo()
    })
  },
  useCoupon(e){//使用优惠券
    let couponCustomerId = e.currentTarget.dataset.couponcustomerid
    let index = e.currentTarget.dataset.index
    this.setData({
      couponCustomerId : couponCustomerId,
      show : false ,
      currentCou : index
    },()=>{
      this.getOrderInfo()
    })
  },
  showCoupon(){//显示优惠券
    let that = this ;
    wx.getStorage({
      key: 'customerId',
      success:res=>{
        app.toRequest('/activity/couponCustomer/couponCustomerAvailableList',{
          data:{
            customerId: res.data,
            shopId : app.globalData.shopId
          }
        }).then(res=>{
          if(res.data.resultCode == 1){
            if(res.data.data.length == 0){
              wx.showToast({
                title: '无优惠券!',
                icon:'none',
                duration:1500
              })
              return
            }
            res.data.data.forEach(item => {
              item.endTime = item.endTime.substring(0,10)
              item.startTime = item.startTime.substring(0,10)
            });
            that.setData({
              couponList : res.data.data,
              show:true
            })
          }
        })
        // wx.request({
        //   url: app.globalData.urlPath + '/activity/couponCustomer/couponCustomerAvailableList',
        //   method:'POST',
        //   data:{
        //     data:{
        //       customerId: res.data,
        //       shopId : app.globalData.shopId
        //     }
        //   },
        //   success:res=>{
        //     if(res.data.resultCode == 1){
        //       if(res.data.data.length == 0){
        //         wx.showToast({
        //           title: '无优惠券!',
        //           icon:'none',
        //           duration:1500
        //         })
        //         return
        //       }
        //       res.data.data.forEach(item => {
        //         item.endTime = item.endTime.substring(0,10)
        //         item.startTime = item.startTime.substring(0,10)
        //       });
        //       that.setData({
        //         couponList : res.data.data,
        //         show:true
        //       })
        //     }
        //   }
        // })
      }
    })
    
  },
  addPhone(){//获取手机号码

  },
  add(){//收货地址
    wx.navigateTo({
      url: '../address/address?type=select',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      skuId : options.skuId,
      count : options.count,
      shopName : app.globalData.shopName
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
  onShow: function (e) {
    this.getList()
    console.log(app.globalData.addressItem.customerAddressId)
    if(app.globalData.addressItem.customerAddressId){
      this.setData({
        customerAddressId : app.globalData.addressItem.customerAddressId
      })
    }
    this.setData({
      phone : app.globalData.phone,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.addressItem = {}
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