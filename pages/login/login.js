let app = getApp();
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        top:''
    },
    onLoad: function(options) {
        var that = this;
        
        var hgid = '';
        //获取到带参二维码的参数
        if (options.hgid) {
            hgid = options.hgid;
            app.globalData.userInfo.lastcont = hgid
            app.globalData.lastcont = hgid;

        }
        // 查看是否授权
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo'] && wx.getStorageSync('openid') && wx.getStorageSync('token')) {
                    wx.switchTab({
                    url: '../home/home',
                    })
                    wx.getUserInfo({
                        success: function(res) {
                            //从数据库获取用户信息
                            app.globalData.userInfo = res.userInfo
                            //  console.log(app.globalData.userInfo);
                            //用户已经授权过
                            
                        }
                    });
                }
            }
        })

        
    },
    /**
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow: function(options) {
        var that = this;
        if (getApp().globalData.openid) {} else {
            // that.wxlogin();
        }
    },
    getPhoneNumber(e){
        console.log(e)
    },
    bindGetUserInfo: function(e) {
        var that = this;
        let code = ''
        wx.showLoading({
          title: '登录中...',
          icon:'loading',
          duration:15000
        })
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            //插入登录的用户的相关信息到数据库
            wx.login({
                success: res => {
                code = res.code
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.getUserInfo({
                    success: function(res) {
                        //从数据库获取用户信息
                        app.globalData.userInfo = res.userInfo
                        wx.request({
                            url: app.globalData.urlPath+'/customer/customerInfo/login',
                            method: "post",
                            data: {
                                data:{
                                    "headImage": app.globalData.userInfo.avatarUrl,
                                    "nickname": app.globalData.userInfo.nickName,
                                    "jsCode": code,
                                    "shopId": app.globalData.shopId
                                }
                            },
                            success:res=>{
                                if(res.data.resultCode == 1){
                                    app.globalData.openid = res.data.data.openid;
                                    app.globalData.customerId = res.data.data.customerId;
                                    // wx.setStorage({
                                    //     key:"customerId",
                                    //     data:res.data.data.customerId
                                    // })
                                    wx.setStorageSync('openid', res.data.data.openid)
                                    wx.setStorageSync('customerId', res.data.data.customerId)
                                    wx.hideLoading()
                                    wx.setStorageSync('token', res.data.data)
                                    // wx.navigateBack({
                                    //     delta : 1
                                    // })
                                    wx.switchTab({  
                                    url: '../home/home'
                                    })
                                    // wx.request({
                                    //     url: app.globalData.urlPath+'/login',
                                    //     method:'POST',
                                    //     data:{
                                    //         data:{"appSecret":""}
                                    //     },
                                    //     success:(res)=>{
                                    //         wx.hideLoading()
                                    //         wx.setStorageSync('token', res.data.data)
                                    //         // wx.navigateBack({
                                    //         //     delta : 1
                                    //         // })
                                    //         wx.switchTab({  
                                    //         url: '../home/home'
                                    //         })
                                    //     }
                                    //   })
                                    
                                    // app.toRequest('/login',{"appSecret":""})
                                    
                                }else{
                                    wx.showToast({
                                        title:'登录失败',
                                        icon:'none',
                                        duration:2000
                                    })
                                }
                            }
                        })
                    }
                });
              }
            })
            
            //授权成功后，跳转进入小程序首页
        } else {
            //用户按了拒绝按钮
            wx.showModal({
              title: '授权提示',
              content: '您选择了取消授权，无法使用供销小店。',
                showCancel: false,
                confirmText: '我知道了',
                success: function(res) {
                    if (res.confirm) {
                        // console.log('用户点击了“返回授权”')
                    }
                }
            })
        }


    },
    //获取用户信息接口
    queryUsreInfo: function() {
        console.log(app.globalData.userInfo)
        wx.request({
            url: app.globalData.urlPath+"/customer/customerInfo/getDetailsById",
            method:'post',
            data: {
                data: {
                    customerId:app.globalData.customerId,
                    headImage: app.globalData.userInfo.avatarUrl,
                    nickname: app.globalData.userInfo.nickName
                }
            },
            success: function(res) {
              app.globalData.userInfo = res.data.userInfo;
              if (app.globalData.customerId && getApp().globalData.openid) {
                
              }
            }
        });
    },
    wxlogin: function() {
        var that = this;
        wx.login({
            success: res => {
                app.globalData.code = res.code
                wx.request({
                    url: app.globalData.urlPath+'/customer/customerInfo/login',
                    method: "post",
                    data: {
                        data:{
                            "jsCode": res.code,
                            "shopId": app.globalData.shopId
                        }
                    },
                    success:res=>{
                        if(res.data.resultCode == 1){
                            app.globalData.openid = res.data.data.openid;
                            app.globalData.customerId = res.data.data.customerId;
                            wx.setStorageSync('openid', app.globalData.openid)
                            that.queryUsreInfo();
                        }else{
                            wx.showToast({
                            title: '登录失败!',
                            icon: 'none',
                            duration: 2000
                            })
                        }
                    }
                })
            }
        })

        
    }

})