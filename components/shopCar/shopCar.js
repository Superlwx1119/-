// components/shopCar/shopCar.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList:[],
    goodsInfo:{},
    goodsInCar:app.globalData.goodsInCar,
    msgOfCar:app.globalData.msgOfCar,
    showCar:false,
    addDetail:{},//选择商品
    goodsArr:[],
    show:false,
    selectSku:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  showComponent(addDetail){//选规格
    let goodsInCar = this.data.goodsInCar
    
    addDetail.count = 1
    this.setData({
      show:true,
      addDetail:addDetail
    })
    app.globalData.goodsInCar.forEach((item,index)=>{
      if(item.goodsId == addDetail.goodsId){
        addDetail.skuList.forEach((i)=>{
          if(item.skuId == i.skuId){
            addDetail.count = item.count ? item.count : 1
            addDetail.skuName = item.skuName
            addDetail.specifications = item.specifications
            let skuList = []
            addDetail.specsKeyList.forEach((s,sIndex)=>{
              s.skuId = i.skuId
              let thisIndex = 0
              if(s.skuId = i.skuId){
                let specsValueList = item.specsValueList.split(',')
                s.specsValueList.forEach((h,hIndex)=>{
                  specsValueList.forEach(v=>{
                    if(v == h.specsValueId){
                      thisIndex = hIndex
                    }
                  })
                  
                })
              }
              let json={
                item : s,
                arrIndex : sIndex,
                index: thisIndex ,
                count :item.count
              }
              skuList.push(json)

            })
            skuList.forEach(item=>{
              this.selectOne('e',item)

            })
          }
        })
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
    let selectSku = {}
    obj.skuList.forEach(item=>{
      if(item.skuName == checkStr.toString()){
        obj.actualPriceGoods = item.actualPrice
        obj.oldPriceGoods = item.oldPrice
        selectSku = item
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
      }
      // else{
      //   obj.count = 0
      // }
    })
    this.setData({
      addDetail : obj,
      selectSku : selectSku
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
    if(addDetail.count<=0 || !addDetail.count){
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
    let goodsInCar = this.data.goodsInCar
    let selectSku = this.data.selectSku
    selectSku.imageMainList = addDetail.imageMainList
    selectSku.goodsId = addDetail.goodsId
    selectSku.count = addDetail.count
    selectSku.goodsName = addDetail.goodsName
    selectSku.specifications = addDetail.specifications
    selectSku.goodsSketch = addDetail.goodsSketch
    let push = true
    goodsInCar.forEach(item=>{
      if(selectSku.skuId == item.skuId){
        item.count += selectSku.count
        push = false
      }
    })
    if(push){
      goodsInCar.push(this.data.selectSku)
    }
    app.globalData.goodsInCar = goodsInCar
    app.globalData.skuId = selectSku.skuId
    this.setData({
      goodsInCar :goodsInCar,
      show:false
    },()=>{
      //调父组件方法
      let goodsInCar = this.data.goodsInCar;
      console.log(app.globalData.goodsInCar)
      this.triggerEvent("getGoodsInCar", goodsInCar);
      this.triggerEvent("setGoodsArr", {goodsInCar,addDetail});
    })
  },
  getPhoneNumber(e){
    console.log(e)
  },
  toPay(){//去结算
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
    let addDetail = this.data.addDetail
    let goodsId = null
    if(goodsInCar[index].count == 1){
      goodsInCar[index].count = 0
      goodsId = goodsInCar[index].goodsId
      goodsInCar.splice(index,1)
      item.count = 0
      addDetail.count = 0
      this.setData({
        goodsInCar : goodsInCar.length == 0 ? [] : goodsInCar,
        showCar: goodsInCar.length==0 ? false : true
      },()=>{
        let goodsInCar = this.data.goodsInCar;
        this.triggerEvent("getGoodsInCar", goodsInCar);
        this.triggerEvent("setGoodsArr", {goodsInCar,addDetail,goodsId:goodsId});
        this.setData({
          msgOfCar : app.globalData.msgOfCar
        })
      })
      return
    }else{
      goodsInCar[index].count--
      item.count--
      addDetail.count--
    }
    this.setData({
      goodsInCar : goodsInCar
    },()=>{
      let goodsInCar = this.data.goodsInCar;
      this.triggerEvent("getGoodsInCar", goodsInCar);
      this.triggerEvent("setGoodsArr", {goodsInCar,addDetail});
      this.setData({
        msgOfCar : app.globalData.msgOfCar
      })
    })
  },
  carAdd(e){//购物车内加
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    let goodsInCar = this.data.goodsInCar
    const addDetail = this.data.addDetail
    goodsInCar[index].count++
    item.count++
    addDetail.count++
    app.globalData.goodsInCar = goodsInCar
    this.setData({
      goodsInCar : goodsInCar
    },()=>{
      //调父组件方法
      let goodsInCar = this.data.goodsInCar;
      this.triggerEvent("getGoodsInCar", goodsInCar);
      this.triggerEvent("setGoodsArr", {goodsInCar,addDetail});
      this.setData({
        msgOfCar : app.globalData.msgOfCar
      })
    })
    
  },
  checkCar(){//已选商品
    if(app.globalData.goodsInCar.length == 0)return
    this.setData({
      showCar :true,
      goodsInCar: app.globalData.goodsInCar,
      msgOfCar : app.globalData.msgOfCar
    })
  },
  selectOne(event,skuList){//选择规格
    let addDetail = JSON.parse(JSON.stringify(this.data.addDetail))
    let item = {}
    if(skuList){
      item = skuList
    }else{
      item = event.currentTarget.dataset
    }
    const goodsInCar = JSON.parse(JSON.stringify(app.globalData.goodsInCar))
    goodsInCar.forEach(i=>{
      if(i.skuId == item.item.skuId){
        addDetail.count = item.item.count ? item.item.count : 1
      }else{
        addDetail.count = 1
      }
    })
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
  reductionNum(){//减
    let addDetail = this.data.addDetail
    if(addDetail.count>=1){
      addDetail.count--
    }else if(!addDetail.count){
      addDetail.count = '0'
    }
    this.setData({
      addDetail : addDetail,
      show :addDetail.count == 0 ? false : true
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
  onLoad: function (options) {

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

  }
})