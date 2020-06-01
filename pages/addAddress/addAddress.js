let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: '',
    customItem: '全部',
    address:'',
    addressName:'',
    name:'',
    phone:'',
    latitude:'',
    longitude:'',
    addressId:''
  },
  bindRegionChange(e){
    let that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.chooseLocation({
          latitude,
          longitude,
          success:res=>{
            that.setData({
              region:res.address,
              longitude:res.longitude,
              latitude:res.latitude,
              addressName : res.name
            })
          },
          fail:res=>{
            wx.getSetting({
              success(res) {
                if (!res.authSetting['scope.userLocation']) {
                  wx.showModal({
                    title: '',
                    content: '请允许小程序获取您的定位',
                    confirmText: '授权',
                    success: function(res) {
                      if (res.confirm) {
                        wx.openSetting();
                      }
                    }
                  });
                } else { //已授权, 但获取地理位置失败, 提示用户去系统设置中打开定位
                  wx.showModal({
                    title: '',
                    content: '请在系统设置中打开定位服务',
                    confirmText: '确定',
                    success: function(res) {}
                  });
                }
    
              }
            })
          }
        })
      }
     })
  },
  bindKeyInput(e){
    let data = this.data
    let type = e.currentTarget.dataset.type
    let value = e.detail.value
    data[type] = value
  },
  addAddress(){
    let that = this;
    if(this.data.name == ''|| this.data.phone =='' || this.data.region == '' || this.data.address == ''){
      wx.showToast({
        title: '地址为填写完整!',
        icon:'none',
        duration:2000
      })
      return
    }
    var phone = this.data.phone;
    if(!(/^1[3456789]\d{9}$/.test(phone))){ 
        wx.showToast({
          title: '手机号码有误，请重填!',
          icon:'none',
          duration:2000
        }) 
        return false; 
    } 
    wx.getStorage({
      key: 'customerId',
      success (res) {
        app.toRequest('/customer/customerAddress/save',{
          "data": {
            "customerId": res.data,
            "customerName": that.data.name,
            "phone": that.data.phone,
            "address": that.data.region,
            "addressName": that.data.addressName,
            "area": that.data.address,
            "longitude": that.data.longitude,
            "latitude": that.data.latitude
          },
        }).then(res=>{
          if(res.data.resultCode == 1){
            wx.showToast({
              title: '添加成功!',
              icon: 'success',
              duration: 1000,
              success:()=>{
                // wx.redirectTo({
                //   url: '../address/address',
                // })
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }else{
            wx.showToast({
              title: '添加失败!',
              duration: 1000
            })
          }
        })
        // wx.request({
        //   url: app.globalData.urlPath+'/customer/customerAddress/save',
        //   method:'POST',
        //   data:{
        //     "data": {
        //       "customerId": res.data,
        //       "customerName": that.data.name,
        //       "phone": that.data.phone,
        //       "address": that.data.region,
        //       "addressName": that.data.addressName,
        //       "area": that.data.address,
        //       "longitude": that.data.longitude,
        //       "latitude": that.data.latitude
        //     },
        //   },
        //   success:res=>{
        //     if(res.data.resultCode == 1){
        //       wx.showToast({
        //         title: '添加成功!',
        //         icon: 'success',
        //         duration: 1000,
        //         success:()=>{
        //           // wx.redirectTo({
        //           //   url: '../address/address',
        //           // })
        //           wx.navigateBack({
        //             delta: 1
        //           })
        //         }
        //       })
        //     }else{
        //       wx.showToast({
        //         title: '添加失败!',
        //         duration: 1000
        //       })
        //     }
        //   }
        // })
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      addressId : app.globalData.addressId
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.addressId = ''
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.reLaunch({
    //   url: '../address/address'
    // })
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