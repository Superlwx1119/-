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
    addressId:'',
    switch1Checked:app.globalData.addressIndex == 0 ? true : false,
    addressIndex:'',
    dialogShow:false,
    buttons: [{text: '取消'}, {text: '确定'}],
  },
  tapDialogButton(e){
    let type = e.detail.index;
    let that = this ;
    if(type == 0){
      this.setData({
        dialogShow : false
      })
    }else{
      
      wx.getStorage({
        key:'customerId',
        success:res=>{
          app.toRequest('/customer/customerAddress/deleteById',{
            "data": {
              "customerAddressId": that.data.addressId,
              "isDefault": that.data.addressIndex == 0 ? 1 : 2,
              "customerId": res.data
            },
          }).then(res=>{
              if(res.data.resultCode == 1){
                wx.showToast({
                  title: '删除成功!',
                  icon:'success',
                  duration:1000,
                  success:()=>{
                    // wx.redirectTo({
                    //   url: '../address/address',
                    // })
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              }
              that.setData({
                dialogShow : false
              })
          })
          // wx.request({
          //   url: app.globalData.urlPath+'/customer/customerAddress/deleteById',
          //   method:'POST',
          //   data:{
          //     "data": {
          //       "customerAddressId": that.data.addressId,
          //       "isDefault": that.data.addressIndex == 0 ? 1 : 2,
          //       "customerId": res.data
          //     },
          //   },
          //   success:res=>{
          //     if(res.data.resultCode == 1){
          //       wx.showToast({
          //         title: '删除成功!',
          //         icon:'success',
          //         duration:1000,
          //         success:()=>{
          //           // wx.redirectTo({
          //           //   url: '../address/address',
          //           // })
          //           wx.navigateBack({
          //             delta: 1
          //           })
          //         }
          //       })
          //     }
          //     that.setData({
          //       dialogShow : false
          //     })
          //   }
          // })
        }
      })
    }
  },
  switch1Change(e){
    let type = e.detail.value
    let that = this ;
    if(type){//设置默认地址
      wx.getStorage({
        key:'customerId',
        success:res=>{
          app.toRequest('/customer/customerAddress/updateDefaultAddress',{
            "data": {
              "customerAddressId": that.data.addressId,
              "customerId": res.data
            },
          }).then(res=>{
            console.log(res)
          })
          // wx.request({
          //   url: app.globalData.urlPath+'/customer/customerAddress/updateDefaultAddress',
          //   method:'POST',
          //   data:{
          //     "data": {
          //       "customerAddressId": that.data.addressId,
          //       "customerId": res.data
          //     },
          //   },
          //   success:res=>{
          //     console.log(res)
          //   }
          // })
        }
      })
    }
    this.setData({
      switch1Checked: type
    })
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
  getDetail(){//地址详情
    app.toRequest('/customer/customerAddress/getDetailsById',{
      "data": {
        "customerAddressId": this.data.addressId
      },
    }).then(res=>{
      if(res.data.resultCode == 1){
        this.setData({
          name:res.data.data.customerName,
          phone:res.data.data.phone,
          latitude:res.data.data.latitude,
          longitude:res.data.data.longitude,
          region:res.data.data.address,
          address:res.data.data.area,
          addressName:res.data.data.addressName
        })
      }
    })
    // wx.request({
    //   url: app.globalData.urlPath+'/customer/customerAddress/getDetailsById',
    //   method:'POST',
    //   data:{
    //     "data": {
    //       "customerAddressId": this.data.addressId
    //     },
    //   },
    //   success:res=>{
    //     if(res.data.resultCode == 1){
    //       this.setData({
    //         name:res.data.data.customerName,
    //         phone:res.data.data.phone,
    //         latitude:res.data.data.latitude,
    //         longitude:res.data.data.longitude,
    //         region:res.data.data.address,
    //         address:res.data.data.area,
    //         addressName:res.data.data.addressName
    //       })
    //     }
    //   }
    // })
  },
  delAddress(){//删除地址
    let that = this ;
    this.setData({
      dialogShow : true 
    })
  },
  saveAddress(){//保存
    let that = this;
    if(this.data.name == ''|| this.data.phone =='' || this.data.region == '' || this.data.address == ''){
      wx.showToast({
        title: '地址为填写完整!',
        duration:2000
      })
      return
    }
    wx.getStorage({
      key: 'customerId',
      success (res) {
        app.toRequest('/customer/customerAddress/save',{
          "data": {
            "customerAddressId": that.data.addressId,
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
        //       "customerAddressId": that.data.addressId,
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
    let check =false
    if(app.globalData.addressIndex == 0){
      check = true
    }
    this.setData({
      addressId : app.globalData.addressId,
      addressIndex : app.globalData.addressIndex,
      switch1Checked : check
    })
    this.getDetail()
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
    app.globalData.addressIndex = ''
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