// pages/goodsDetail/goodsDetail.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top:app.globalData.top,
    banner:["../images/goods.png","../images/goods.png","../images/goods.png"],
    imageList:[],
    goodsInfo:{},
    goodsInCar:app.globalData.goodsInCar,
    msgOfCar:app.globalData.msgOfCar,
    showCar:false,
    addDetail:{},//选择商品
    goodsArr:[],
    goodsId:'',
    skuId:'',
    jian:0,
    cha:0,
    activity:[],
    actualPrice:0,
    scope:0,
    freightFee:0,
    address:''
  },
  getRedctionInfo(){//满减活动列表
    app.toRequest('/activity/reductionInfo/reductionUsableList',{data:{shopId:app.globalData.shopId}}).then(res=>{
      this.setData({
        activity : res.data.data
      },()=>{
        this.setGoodsArr()
      })
    })
    // wx.request({
    //   url: app.globalData.urlPath+'/activity/reductionInfo/reductionUsableList',
    //   method:'POST',
    //   data:{data:{shopId:app.globalData.shopId}},
    //   success:res=>{
    //     this.setData({
    //       activity : res.data.data
    //     },()=>{
    //       this.setGoodsArr()
    //     })
    //   }
    // })
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
  submitOrder(){//确认订单
    let skuId = app.globalData.skuId
    let addDetail = this.data.addDetail
    wx.navigateTo({
      url: '../submitOrder/submitOrder?skuId='+skuId+'&count='+addDetail.count,
    })
  },
  showCar(){
    this.setData({
      showCar : true
    })
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
  toPay(){//去结算
    wx.navigateTo({
      url: '../submitOrder/submitOrder',
    })
  },
  addGood(e){//展开加入购物车框
    if(wx.getStorageSync('openid')){
      let index = e.currentTarget.dataset.index
      let addDetail = {}
      addDetail = app.globalData.appDetail
      this.compData.showComponent(app.globalData.appDetail);
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
    return
    let index = e.currentTarget.dataset.index
    let addDetail = {}
    addDetail = app.globalData.appDetail
    this.compData.showComponent(app.globalData.appDetail);
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
      this.getDetailGoods()
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
  getDetail(goodsId){//商品详情
    let appDetail = app.globalData.appDetail
    wx.showLoading({
      title: '加载中...',
      icon:'loading',
      duration : 15000
    })
    app.toRequest("/goods/goods/getOfCustomer",{data:{goodsId:goodsId}}).then(res=>{
      wx.hideLoading()
      if(res.data.resultCode == 1){
        res.data.data.count = appDetail.count
        this.setData({
          addDetail : res.data.data,
          address:res.data.data.address,
          scope:res.data.data.scope,
          freightFee:res.data.data.freightFee
        })
      }
    })
    // wx.request({
    //   url: app.globalData.urlPath+"/goods/goods/getOfCustomer",
    //   method:'POST',
    //   data:{data:{goodsId:goodsId}},
    //   success:res=>{
    //     wx.hideLoading()
    //     if(res.data.resultCode == 1){
    //       res.data.data.count = appDetail.count
    //       this.setData({
    //         addDetail : res.data.data,
    //         address:res.data.data.address,
    //         scope:res.data.data.scope,
    //         freightFee:res.data.data.freightFee
    //       })
    //     }
    //   }
    // })
  },
  toHome(){
    wx.switchTab({
      url: '../home/home',
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
  toOrder(){
    app.globalData.orderActive = 0
    wx.switchTab({
      url: '../order/order',
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
  getDetailGoods(){
    let addDetail = {}
    let goodsInCar = this.data.goodsInCar
    addDetail = JSON.parse(JSON.stringify(this.data.addDetail))
    addDetail.count = 0
    goodsInCar.forEach(item=>{
      if(item.goodsId == app.globalData.goodsId){
        addDetail.count += item.count
      }
    })
    if(goodsInCar.length==0){
      addDetail.count = 0
    }
    this.setData({
      addDetail:addDetail,
    })
  },
  setMan(e){
    this.setData({
      jian : e.detail ?  e.detail.jian : e.jian ,
      cha : e.detail ? e.detail.cha : e.cha
    })
  },
  setGoodsArr(e){//调整商品列表
    this.data.msgOfCar = app.globalData.msgOfCar
    let skuList = app.globalData.goodsInCar
    let addDetail = e ? e.detail.addDetail : this.data.addDetail
    let goodsArr = this.data.goodsArr
    let actualPrice  = 0
    let goodsId = e ? e.detail.goodsId : null
    let indexThis = null
    if(skuList.length == 0){
        goodsArr.forEach(s=>{
            s.count = 0
        })
    }else{
      goodsArr.forEach((item,index)=>{
        let countThis = 0
        skuList.forEach(s=>{
          if(item.goodsId == s.goodsId){
            countThis += s.count
            indexThis = index
            item.count = s.count
          }
          // if(s.actualPrice != s.oldPrice){
          //   actualPrice += s.actualPrice //折扣商品总价
          //   this.setData({
          //     actualPrice : actualPrice
          //   })
          // }
        })
        if(goodsId == item.goodsId){
          item.count = 0
        }
        if(countThis != 0){
          goodsArr[indexThis].count = countThis
        }
        
      })
    }
    this.setData({
      goodsArr : goodsArr,
      addDetail : addDetail
    })
    let goodsInCar = app.globalData.goodsInCar;
    goodsInCar.forEach(item=>{
      if(item.goodsId == addDetail.goodsId && item.actualPrice != item.oldPrice){
        actualPrice += item.actualPrice //折扣商品总价
        this.setData({
          actualPrice : actualPrice
        })
      }
    })
    if(app.globalData.msgOfCar.curPrice == app.globalData.msgOfCar.befPrice){
      this.data.activity.forEach((item,index)=>{
        if(item.conditions - Number(app.globalData.msgOfCar.curPrice)>0){
          this.setMan({jian : item.discounts.toFixed(2),cha : (item.conditions - app.globalData.msgOfCar.curPrice).toFixed(2),totleJian : index > 0 ? this.data.activity[index-1].discounts : 0})
          // this.triggerEvent("setMan", {jian : item.discounts.toFixed(2),cha : (item.conditions - app.globalData.msgOfCar.curPrice).toFixed(2),totleJian : index > 0 ? this.data.activity[index-1].discounts : 0});
          this.setData({
            jian : item.discounts.toFixed(2) ,
            cha : (item.conditions - app.globalData.msgOfCar.curPrice).toFixed(2)
          })
          throw new Error("没事");
        }else{
          this.setMan({jian : 0,cha : 0 , totleJian : this.data.activity[index].discounts})
          // this.triggerEvent("setMan", {jian : 0,cha : 0 , totleJian : this.data.activity[index].discounts});
          this.setData({
            jian : 0 ,
            cha : 0,
          })
        }
      })
    }else{
      this.data.activity.forEach(item=>{
        if(item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice >0){
          this.setMan({jian : item.discounts.toFixed(2),cha : (item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice).toFixed(2),totleJian : item.discounts})
          // this.triggerEvent("setMan", {jian : item.discounts.toFixed(2),cha : (item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice).toFixed(2),totleJian : item.discounts});
          this.setData({
            jian : item.discounts.toFixed(2) ,
            cha : (item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice).toFixed(2)
          })
          throw new Error("没事");
        }else{
          this.setMan({jian : 0,cha : 0, totleJian : item.discounts})
          // this.triggerEvent("setMan", {jian : 0,cha : 0, totleJian : item.discounts});
          this.setData({
            jian : 0 ,
            cha : 0,
          })
        }
      })
    }
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
  checkCar(){//查看已选商品
    this.compData.checkCar(this.data.addDetail);
    // if(this.data.goodsInCar.length == 0)return
    // this.setData({
    //   showCar:true
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.compData=this.selectComponent("#shopCar");
    this.getDetail(options.goodsId)
    this.setData({
      goodsInCar : app.globalData.goodsInCar,
      msgOfCar : app.globalData.msgOfCar,
      goodsArr : app.globalData.goodsArr,
      goodsId : options.goodsId
    },()=>{
      // this.getDetailGoods()
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
    this.getRedctionInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.skuId = ''
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