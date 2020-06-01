//app.js
App({
  onLaunch: function () {

    let that = this ;
    
    let extConfig = wx.getExtConfigSync?wx.getExtConfigSync():{}
    that.globalData.shopId = extConfig.shopId;
    that.globalData.urlPath = extConfig.baseUrl;

    
    wx.getSystemInfo({
        success: function success(res) {
          var ios = !!(res.system.toLowerCase().search('ios') + 1);
          that.globalData.statusBarHeight = res.statusBarHeight;
          that.globalData.ios = ios;
          let  top = '';
          if(that.globalData.ios) {
              top = Number(that.globalData.statusBarHeight) + 44 ;
          } else {
              top = Number(that.globalData.statusBarHeight) + 48 ;
          }
          that.globalData.top = top;
        }
    });

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     this.globalData.code = res.code
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getLocation(){
    return new Promise((resolve,reject)=>{
      wx.getLocation({
        success: (res) => {
          resolve(res);
        },
        fail:  (res) => {
          reject(data)
        }
      })
    })
  },
  toRequest(url,data){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: this.globalData.urlPath + url,
        header:{"Authorization":wx.getStorageSync('token')},
        method:'POST',
        data:data ? data : {},
        success:res=>{
          if(res.data.resultCode == 402){
            wx.removeStorageSync('token')
            wx.showToast({
              title: '登录过期,请重新登录!',
              icon:'none',
              duration: 1500,
              success:()=>{
                wx.navigateTo({
                  url: '../login/login?token=1',
                })
              }
            })
          }
          resolve(res);
        },
        fail:res=>{
          reject(res)
        }
      })
    }) 
  },
  globalData: {
    urlPath:'http://192.168.103.62:17101',
    // urlPath:"https://sapp.csgxcf.com/smc",
    userInfo: null,
    shopName:'',
    shopImage:'',
    swiperHeight:'',
    shopId:'',
    code:'',
    customerId:'',
    goodsId:'',
    orderActive:0,//订单tab
    goodsInCar:[],//购物车内商品
    msgOfCar:[],//购物车信息(价格数量),
    addressId:'',
    addressIndex:'',
    appDetail:{},
    toRefundList:[],
    addressItem:{},
    skuId:'',
    refundActive:0,
    phone:''
  }
})