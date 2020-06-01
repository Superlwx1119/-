// pages/home/home.js
let app = getApp() ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      //预加载
      container:null,
      model:false,
      jian:0,
      cha:0,
      hidden: false,
      title:'',
      latitude:'',//纬度
      longitude:'',//经度
      shopNotice:'',
      shopInfo:{
        distance:0,
        scope:0
      },//商品信息
      //侧边栏选择
      curNav: 0,
      background:['../images/banner3.jpg','../images/banner2.jpg'],
      show:false,
      showCar:false,
      showNav:false,
      radioHeight:0,
      top:app.globalData.top,
      cataActive:0,
      goodsActive:0,
      sortPanelDist:50,
      timer:null,
      cataArr:[],//左侧菜单
      goodsArr:[],//商品列表
      couponsArr:[],//卡券列表
      activity:[],//活动标签
      animation:'',
      addList:[],
      addDetail:{},//选择商品
      goodsInCar:[],//购物车中的商品
      msgOfCar:{//购物车价格信息
        count:0,
        curPrice:0,
        befPrice:0
      },
      actualPrice:0,
      totleJian:0
  },
  getCoupon(e){//领取优惠券
    if(wx.getStorageSync('openid')){
      let couponId = e.currentTarget.dataset.couponid
      let that = this ;
      wx.getStorage({
        key: 'customerId',
        success (res) {
          app.toRequest('/activity/couponCustomer/couponReceive',{
            data:{
              "customerId": res.data,
              "couponId": couponId,
            }
          }).then(res=>{
            if(res.data.resultCode == 1){
              wx.showToast({
                title: '领取成功!',
                icon:'success',
                duration:1500
              })
              that.getCouponList()
            }else{
              wx.showToast({
                title: res.data.resultInfo,
                icon:'none',
                duration:1500
              })
            }
          })
          // wx.request({
          //   url: app.globalData.urlPath+'/activity/couponCustomer/couponReceive',
          //   method:"POST",
          //   data:{
          //     data:{
          //       "customerId": res.data,
          //       "couponId": couponId,
          //     }
          //   },
          //   success:res=>{
          //     if(res.data.resultCode == 1){
          //       wx.showToast({
          //         title: '领取成功!',
          //         icon:'success',
          //         duration:1500
          //       })
          //       that.getCouponList()
          //     }else{
          //       wx.showToast({
          //         title: res.data.resultInfo,
          //         icon:'none',
          //         duration:1500
          //       })
          //     }
          //   }
          // })
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请登录!',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login',
            })
          } else if (res.cancel) {
            wx.switchTab({
              url: '../home/home',
            })
          }
        }
      })
    }
    
  },
  getCouponList(){//商铺优惠券
    let that = this ;
    wx.getStorage({
      key: 'customerId',
      success (res) {
        app.toRequest('/activity/couponCustomer/couponReceiveList',{
          data:{
            "customerId": res.data,
            "couponCustomerStatus": 0,
            "shopId": app.globalData.shopId
          }
        }).then(res=>{
          if(res.data.resultCode == 1){
            that.setData({
              couponsArr : res.data.data
            })
          }
        })
        // wx.request({
        //   url: app.globalData.urlPath+'/activity/couponCustomer/couponReceiveList',
        //   method:"POST",
        //   data:{
        //     data:{
        //       "customerId": res.data,
        //       "couponCustomerStatus": 0,
        //       "shopId": app.globalData.shopId
        //     }
        //   },
        //   success:res=>{
        //     if(res.data.resultCode == 1){
        //       that.setData({
        //         couponsArr : res.data.data
        //       })
        //     }
        //   }
        // })
      }
    })
    
  },
  initText(obj){//s商品规格格式化
    let str='已选:'
    let checkStr = []
    
    obj.specsKeyList.forEach(item=>{
      item.specsValueList.forEach(i=>{
        if(i.selected){
          str+=i.specsValueName+'/'
          checkStr.push(i.specsValueName)
        }
      })
    })
    obj.skuList.forEach(item=>{
      if(item.skuName == checkStr.toString()){
        obj.actualPriceGoods = item.actualPrice
        obj.oldPriceGoods = item.oldPrice
      }
    })
    if(str.indexOf('/')<0){
      str = '未选择规格'
    }else{
      str = str.substring(0,str.length-1)
    }
    obj.specifications = str;
    this.data.goodsInCar.forEach(s=>{
      if(s.goodsId == obj.goodsId && obj.specifications == s.specifications){
        obj.count = s.count 
        this.setData({
          addDetail : obj
        })
      }else{
        obj.count = 0
      }
    })
    this.setData({
      addDetail : obj
    })
    
  },
  selectOne(event){//选择规格
    const addDetail = this.data.addDetail
    const item = event.currentTarget.dataset
    const goodsInCar = this.data.goodsInCar
    if(item.item.specsValueList[item.index].selected){
      item.item.specsValueList[item.index].selected = false
      addDetail.specsKeyList[item.arrindex] = item.item
      this.setData({
        addDetail : addDetail
      })
      this.initText(addDetail)
      return
    }

    item.item.specsValueList.forEach(item=>{
      item.selected = false
    })
    if(item.item.specsValueList[item.index].selected ){
      item.item.specsValueList[item.index].selected = false
    }else{
      item.item.specsValueList[item.index].selected = true
    }
    addDetail.specsKeyList[item.arrindex] = item.item
    
    this.setData({
      addDetail : addDetail
    })
    this.initText(addDetail)
  },
  getShopPosition(){//获取店铺位置
    let latitude = this.data.shopInfo.latitude
    let longitude = this.data.shopInfo.longitude
    // wx.openLocation({
    //   latitude,
    //   longitude,
    //   scale: 18
    // })
    wx.navigateTo({
      url: '../shopAddress/shopAddress?latitude='+latitude+'&longitude='+longitude+'&shopName='+this.data.shopInfo.shopName,
    })
  },
  setGoodsArr(e){//调整商品列表
    this.data.msgOfCar = app.globalData.msgOfCar
    let skuList = app.globalData.goodsInCar
    // let addDetail = e.detail.addDetail
    // console.log(wx.getStorageSync('goodsArr'))
    
    // let goodsArr = wx.getStorageSync('goodsArr') == '' ?  this.data.goodsArr : JSON.parse(wx.getStorageSync('goodsArr'))
    let goodsArr = this.data.goodsArr
    let goodsId = e ? e.detail.goodsId : null
    let actualPrice = 0
    let oldPrice = 0
    let actualArr = []
    let indexThis = null
    this.setData({
      actualPrice : 0
    })
    // if(skuList.length == 0){
    //     goodsArr.forEach(s=>{
    //         s.count = 0
    //     })
    // }else{
    //   goodsArr.forEach((item,index)=>{
    //     let countThis = 0
    //     skuList.forEach(s=>{
    //       if(item.goodsId == s.goodsId){
    //         countThis += s.count
    //         indexThis = index
    //         item.count = s.count
    //         }
          
    //     })
    //     if(goodsId == item.goodsId){
    //       item.count = 0
    //     }
    //     if(countThis != 0){
    //       goodsArr[indexThis].count = countThis
    //     }
        
    //   })
      
    // }
    this.setData({
      goodsArr : goodsArr
    })
    // wx.setStorage({
    //   data: JSON.stringify(goodsArr),
    //   key: 'goodsArr',
    // })
    //满减计算
    // if(app.globalData.msgOfCar.curPrice == app.globalData.msgOfCar.befPrice){
    //   this.data.activity.forEach(item=>{
    //     if(item.conditions - Number(app.globalData.msgOfCar.curPrice)>0){
    //       this.setData({
    //         jian : item.discounts.toFixed(2) ,
    //         cha : (item.conditions - app.globalData.msgOfCar.curPrice).toFixed(2)
    //       })
    //       throw new Error("没事");
    //     }else{
    //       this.setData({
    //         jian : 0 ,
    //         cha : 0
    //       })
    //     }
    //   })
    // }else{
    //   this.data.activity.forEach(item=>{
    //     if(item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice >0){
    //       this.setData({
    //         jian : item.discounts.toFixed(2) ,
    //         cha : (item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice).toFixed(2)
    //       })
    //       throw new Error("没事");
    //     }else{
    //       this.setData({
    //         jian : 0 ,
    //         cha : 0
    //       })
    //     }
    //   })
    // }
  },
  setMan(e){
    this.setData({
      jian : e.detail.jian ,
      cha : e.detail.cha,
      totleJian : e.detail.totleJian
    })
  },
  toPay(e){//去结算
    // console.log(e)
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
  carReduction(e){//购物车内减
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    let goodsInCar = this.data.goodsInCar
    if(goodsInCar[index].count == 1){
      goodsInCar[index].count--
      goodsInCar.splice(index,1)
      this.setData({
        goodsInCar : goodsInCar.length == 0 ? [] : goodsInCar,
        showCar: goodsInCar.length==0 ? false : true
      },()=>{
        this.initMsgOfCar()
      })
      return
    }else{
      goodsInCar[index].count--
    }
    this.setData({
      goodsInCar : goodsInCar
    },()=>{
      this.initMsgOfCar()
    })
  },
  carAdd(e){//购物车内加
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    let goodsInCar = this.data.goodsInCar
    goodsInCar[index].count++
    this.setData({
      goodsInCar : goodsInCar
    },()=>{
      this.initMsgOfCar()
    })
    
  },
  initMsgOfCar(){//计算购物车
    let goodsInCar = this.data.goodsInCar
    let goodsArr = this.data.goodsArr
    let msgOfCar = this.data.msgOfCar
    msgOfCar.curPrice = 0
    msgOfCar.befPrice = 0
    msgOfCar.count = 0
    
    goodsInCar.forEach(item=>{
      msgOfCar.count += item.count
      msgOfCar.curPrice += item.count*Number(item.actualPriceGoods)
      msgOfCar.befPrice += item.count*Number(item.oldPriceGoods)
    })
    goodsArr.forEach(item=>{
      item.count = 0
      goodsInCar.forEach(i=>{
        if(item.goodsId == i.goodsId){
          item.count += i.count
        }
      })
    })
    msgOfCar.curPrice = Number(msgOfCar.curPrice).toFixed(2)
    msgOfCar.befPrice = Number(msgOfCar.befPrice).toFixed(2)
    this.setData({
      msgOfCar : msgOfCar,
      goodsArr : this.data.goodsArr
    },()=>{
      app.globalData.msgOfCar = msgOfCar
      app.globalData.goodsInCar = goodsInCar
      app.globalData.goodsArr = goodsArr
    })
  },
  selectNav(event){//选择菜单栏目
    let index = event.currentTarget.dataset.item.sort
    let title =  event.currentTarget.dataset.item.goodsTypeName
    this.setData({
      cataActive:index,
      title:title
    })
    this.getGoodsList(event.currentTarget.dataset.item.goodsTypeId,title);
  },
  reductionNum(){//减少数量
    let addDetail = this.data.addDetail
    if(addDetail.count>1){
      addDetail.count--
    }else if(addDetail.count==1 || !addDetail.count){
      addDetail.count = '0'
    }
    this.setData({
      addDetail : addDetail
    })
  },
  addNum(){//加
    let addDetail = this.data.addDetail
    if(addDetail.count){
      addDetail.count++
    }else{
      addDetail.count = 1
    }
    this.setData({
      addDetail : addDetail
    })
  },
  addShopCar(){//加入购物车
    const addDetail = this.data.addDetail
    let pass = 0
    addDetail.specsKeyList.forEach(item=>{
      item.specsValueList.forEach(i=>{
        if(i.selected){
          pass++
        }
      })
    })
    if(addDetail.count<=0){
      wx.showToast({
        title: '数量不能为零!',
        icon: 'none',
        duration: 2000
      })
      return
    }else if(!addDetail.specifications||addDetail.specifications == '未选择规格'|| pass != addDetail.specsKeyList.length){
      wx.showToast({
        title: '请选择规格!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let arr = this.data.goodsInCar
    let goodsArr = this.data.goodsArr
    arr.push(addDetail)
    let goodsId = ''
    let specifications = ''
    let count = 0
    let arrIndex = 0
    arr.forEach((item,index)=>{
      if(item.goodsId == goodsId && index>0){//重复
        if(item.specifications == specifications){//规格一致  加数量
          item.count = item.count + count
          arr.splice(arrIndex,1)
          
        }else{//另起一行
          console.log(2222)
        }
      }
      goodsId = item.goodsId
      specifications = item.specifications
      count = item.count
      arrIndex = item.arrIndex
    })
    this.setData({
      goodsInCar : arr,
      show : false
    },()=>{
      this.initMsgOfCar()
    })
  },
  getGoodsInCar(e){//遍历购物车
    let goodsInCar = app.globalData.goodsInCar
    let msgOfCar = this.data.msgOfCar
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
    },()=>{
      app.globalData.msgOfCar = msgOfCar
      app.globalData.goodsInCar = goodsInCar
    })
  },
  getPhoneNumber(e){
    console.log(e)
  },
  checkCar(){//查看已选商品
    this.compData.checkCar();
    // if(this.data.goodsInCar.length == 0)return
    // this.setData({
    //   showCar:true
    // })
  },
  buttontap(){
    console.log(222)
  },
  addGood(e){//展开加入购物车框
    if(wx.getStorageSync('openid')){
      let index = e.currentTarget.dataset.index
      let addDetail = {}
      addDetail = JSON.parse(JSON.stringify(this.data.goodsArr[index]))
      addDetail.count = 0
      this.compData.showComponent(addDetail);
    }else{
      wx.showModal({
        title: '提示',
        content: '请登录!',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login',
            })
          } else if (res.cancel) {
            wx.switchTab({
              url: '../home/home',
            })
          }
        }
      })
      
    }
    
  },
  showDetail(e){//查看商品详情
    let goodsId = e.currentTarget.dataset.goodsid
    app.globalData.appDetail = this.data.goodsArr[e.currentTarget.dataset.index]
    app.globalData.goodsId = goodsId
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?goodsId='+goodsId,
    })
  },
  getGoodsList(id,name){//获取商品列表
    app.toRequest("/goods/goods/listOfCustomer",{
      "data": {
        "goodsTypeId": id,
        "shopId": app.globalData.shopId,
      },
    }).then(res=>{
      res.data.data.list.forEach(item=>{
        item.count = 0
      })
      this.setData({
        goodsArr : res.data.data.list
      },()=>{
        app.globalData.goodsArr = res.data.data.list
        this.setGoodsArr()
      })
    })
    // wx.request({
    //   url: app.globalData.urlPath+"/goods/goods/listOfCustomer",
    //   method:'POST',
    //   data:{
    //     "data": {
    //       "goodsTypeId": id,
    //       "shopId": app.globalData.shopId,
    //     },
    //   },
    //   success:res=>{
    //     res.data.data.list.forEach(item=>{
    //       item.count = 0
    //     })
    //     this.setData({
    //       goodsArr : res.data.data.list
    //     },()=>{
    //       app.globalData.goodsArr = res.data.data.list
    //       this.setGoodsArr()
    //     })
    //   }
    // })
  },  
  getShopInfo(){//获取商户信息
    app.toRequest('/shop/shopInfo/getShopInfoToCustomer',{
      "data": {
        "shopId": app.globalData.shopId,
        "longitude": this.data.longitude,
        "latitude": this.data.latitude
      },
    }).then(res=>{
      if(res.data.resultCode == 1){
        res.data.data.distance = Number(res.data.data.distance/1000).toFixed(2)*1000
        res.data.data.shopImage = JSON.parse(res.data.data.shopImage)[0]
        app.globalData.shopImage = res.data.data.shopImage
        app.globalData.shopName = res.data.data.shopName
        this.setData({
          shopInfo:res.data.data
        })
      }
    })
    // wx.request({
    //   url: app.globalData.urlPath+'/shop/shopInfo/getShopInfoToCustomer',
    //   method:'POST',
    //   data:{
    //     "data": {
    //       "shopId": app.globalData.shopId,
    //       "longitude": this.data.longitude,
    //       "latitude": this.data.latitude
    //     },
    //   },
    //   success:res=>{
    //     if(res.data.resultCode == 1){
    //       res.data.data.distance = Number(res.data.data.distance/1000).toFixed(2)*1000
    //       res.data.data.shopImage = JSON.parse(res.data.data.shopImage)[0]
    //       app.globalData.shopName = res.data.data.shopName
    //       this.setData({
    //         shopInfo:res.data.data
    //       })
    //     }
    //   }
    // })
  },
  getNotice(){//商品公告
    app.toRequest('/shop/shopNotice/getShopNoticeByShopId',{data:{shopId:app.globalData.shopId}}).then(res=>{
      if(res.data.resultCode == 1){
        this.setData({
          shopNotice:res.data.data.content,
          // background : JSON.parse(res.data.data.image)
        })
      }
    })
    // wx.request({
    //   url: app.globalData.urlPath+'/shop/shopNotice/getShopNoticeByShopId',
    //   method:'POST',
    //   data:{data:{shopId:app.globalData.shopId}},
    //   success:res=>{
    //     if(res.data.resultCode == 1){
    //       this.setData({
    //         shopNotice:res.data.data.content
    //       })
    //     }
    //   }
    // })
  },
  getGoodsType(){//获取商品分类
    app.toRequest("/goods/goodsType/listOfCustomer",{data:{shopId:app.globalData.shopId}}).then(res=>{
      if(res.data.resultCode == 1){
        this.setData({
          cataArr:res.data.data.list,
          cataActive:res.data.data.list[0].sort,
          title:res.data.data.list[0].goodsTypeName
        })
        this.getGoodsList(res.data.data.list[0].goodsTypeId,res.data.data.list[0].goodsTypeName)
      }
    })
    // wx.request({
    //   url: app.globalData.urlPath+"/goods/goodsType/listOfCustomer",
    //   method:'POST',
    //   data:{data:{shopId:app.globalData.shopId}},
    //   success:res=>{
    //     if(res.data.resultCode == 1){
    //       this.setData({
    //         cataArr:res.data.data.list,
    //         cataActive:res.data.data.list[0].sort,
    //         title:res.data.data.list[0].goodsTypeName
    //       })
    //       this.getGoodsList(res.data.data.list[0].goodsTypeId,res.data.data.list[0].goodsTypeName)
    //     }
    //   }
    // })
  },
  getRedctionInfo(){//满减活动列表
    app.toRequest('/activity/reductionInfo/reductionUsableList',{data:{shopId:app.globalData.shopId}}).then(res=>{
      this.setData({
        activity : res.data.data
      })
    })
    // wx.request({
    //   url: app.globalData.urlPath+'/activity/reductionInfo/reductionUsableList',
    //   method:'POST',
    //   data:{data:{shopId:app.globalData.shopId}},
    //   success:res=>{
    //     this.setData({
    //       activity : res.data.data
    //     })
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  toQualification(){//查资质
    wx.navigateTo({
      url: '../shopQualification/shopQualification',
    })
  },
  onLoad: function (options) {
    // wx.request({
    //   url: app.globalData.urlPath+'/login',
    //   method:'POST',
    //   data:{
    //       data:{"appSecret":""}
    //   },
    //   success:(res)=>{
    //       wx.setStorageSync('token', res.data.data)
    //       wx.getSystemInfo({
    //         complete: (res) => {
    //           if(res.model == "iPhone X" || res.model == "iPhone XR" || res.model == "iPhone XS Max"){
    //             this.setData({
    //               model : true
    //             })
    //           }
    //         },
    //       })
    //       this.getRedctionInfo()
    //       this.getGoodsType()
    //       this.getNotice()
    //       this.loadingChange()
    //       this.getCouponList()
    //       this.compData=this.selectComponent("#shopCar");
    //       app.getLocation().then((res)=>{
    //         this.setData({
    //           longitude:res.longitude,
    //           latitude:res.latitude
    //         })
    //         this.getShopInfo()
    //       })
    //       this.getGoodsInCar()
    //       // this.initMsgOfCar()
    //       this.setGoodsArr()
    //   }
    // })
    wx.getSystemInfo({
      complete: (res) => {
        if(res.model == "iPhone X" || res.model == "iPhone XR" || res.model == "iPhone XS Max"){
          this.setData({
            model : true
          })
        }
      },
    })
    this.getRedctionInfo()
    this.getGoodsType()
    this.getNotice()
    this.loadingChange()
    this.getCouponList()
    this.compData=this.selectComponent("#shopCar");
    app.getLocation().then((res)=>{
      this.setData({
        longitude:res.longitude,
        latitude:res.latitude
      })
      this.getShopInfo()
    })
    this.getGoodsInCar()
    // this.initMsgOfCar()
    this.setGoodsArr()
    
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      container: () => wx.createSelectorQuery().select('#cataAndGoods')
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let openid = wx.getStorageSync('openid')
    // // let openid = 1
    // console.log(typeof openid,openid)
    // if(openid){
      
    // }else{
    //   wx.navigateTo({
    //     url: '../login/login',
    //   })
    // }
    this.setData({
      msgOfCar : app.globalData.msgOfCar,
      goodsInCar : app.globalData.goodsInCar
    })
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
  },
  loadingChange() {
    setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 2000)
  },
  onPageScroll(ev){
    let height = 0
    let that =this;
    var query = wx.createSelectorQuery();
    query.select('.header-banner').boundingClientRect(function (rect) {
      if(rect.top<=-240){
        that.setData({
          showNav:true,
        })
      }
      if(rect.top > -177 && that.data.showNav){
          that.setData({
            showNav:false,
          })
      }
    }).exec();
    // if(ev.scrollTop > 130) {
    //   this.setData({
    //     showNav:true,
    //   })
    // } else {
    //   this.setData({
    //     showNav:false
    //   })
    // }
     
   }
})