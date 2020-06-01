let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
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
    selectSku:{},
    actualPrice:0,
    activity:[],
    count:1,
    totleJian:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    showComponent(addDetail){//选规格
      addDetail = JSON.parse(JSON.stringify(addDetail))
      app.toRequest('/activity/reductionInfo/reductionUsableList',{data:{shopId:app.globalData.shopId}}).then(res=>{
        this.setData({
          activity : res.data.data
        },()=>{
          let goodsInCar = this.data.goodsInCar
          addDetail.count = 1
          this.setData({
            show:true,
            addDetail:addDetail
          })
          // app.globalData.goodsInCar.forEach((item,index)=>{
          //   if(item.goodsId == addDetail.goodsId){
          //     addDetail.skuList.forEach((i)=>{
          //       if(item.skuId == i.skuId){
          //         addDetail.count = item.count ? item.count : 1
          //         addDetail.skuName = item.skuName
          //         addDetail.specifications = item.specifications
          //         let skuList = []
          //         addDetail.specsKeyList.forEach((s,sIndex)=>{
          //           s.skuId = i.skuId
          //           let thisIndex = 0
          //           if(s.skuId = i.skuId){
          //             let specsValueList = item.specsValueList.split(',')
          //             s.specsValueList.forEach((h,hIndex)=>{
          //               specsValueList.forEach(v=>{
          //                 if(v == h.specsValueId){
          //                   thisIndex = hIndex
          //                 }
          //               })
                        
          //             })
          //           }
          //           let json={
          //             item : s,
          //             arrIndex : sIndex,
          //             index: thisIndex ,
          //             count :item.count
          //           }
          //           skuList.push(json)
      
          //         })
          //         skuList.forEach(item=>{
          //           this.selectOne('e',item)
      
          //         })
          //       }
          //     })
          //   }
          // })
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
      //       let goodsInCar = this.data.goodsInCar
      //       addDetail.count = 1
      //       this.setData({
      //         show:true,
      //         addDetail:addDetail
      //       })
      //       // app.globalData.goodsInCar.forEach((item,index)=>{
      //       //   if(item.goodsId == addDetail.goodsId){
      //       //     addDetail.skuList.forEach((i)=>{
      //       //       if(item.skuId == i.skuId){
      //       //         addDetail.count = item.count ? item.count : 1
      //       //         addDetail.skuName = item.skuName
      //       //         addDetail.specifications = item.specifications
      //       //         let skuList = []
      //       //         addDetail.specsKeyList.forEach((s,sIndex)=>{
      //       //           s.skuId = i.skuId
      //       //           let thisIndex = 0
      //       //           if(s.skuId = i.skuId){
      //       //             let specsValueList = item.specsValueList.split(',')
      //       //             s.specsValueList.forEach((h,hIndex)=>{
      //       //               specsValueList.forEach(v=>{
      //       //                 if(v == h.specsValueId){
      //       //                   thisIndex = hIndex
      //       //                 }
      //       //               })
                          
      //       //             })
      //       //           }
      //       //           let json={
      //       //             item : s,
      //       //             arrIndex : sIndex,
      //       //             index: thisIndex ,
      //       //             count :item.count
      //       //           }
      //       //           skuList.push(json)
        
      //       //         })
      //       //         skuList.forEach(item=>{
      //       //           this.selectOne('e',item)
        
      //       //         })
      //       //       }
      //       //     })
      //       //   }
      //       // })
      //     })
      //   }
      // })
      addDetail.specsKeyList.forEach((item,index)=>{
        item.specsValueList.forEach((s,i)=>{
          if(i == 0){
            s.selected = true
            this.initText(addDetail)

          }
        })
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
      let actualPrice =0
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
      let goodsInCar = app.globalData.goodsInCar
      let selectSku = this.data.selectSku
      selectSku.imageMainList = addDetail.imageMainList
      selectSku.goodsId = addDetail.goodsId
      selectSku.count = this.data.count
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
        show:false,
        count: 1
      },()=>{
        //调父组件方法
        let goodsInCar = this.data.goodsInCar;
        this.triggerEvent("getGoodsInCar", goodsInCar);
        this.triggerEvent("setGoodsArr", {goodsInCar,addDetail});
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
              this.triggerEvent("setMan", {jian : item.discounts.toFixed(2),cha : (item.conditions - app.globalData.msgOfCar.curPrice).toFixed(2),totleJian : index > 0 ? this.data.activity[index-1].discounts : 0});
              this.setData({
                jian : item.discounts.toFixed(2) ,
                cha : (item.conditions - app.globalData.msgOfCar.curPrice).toFixed(2)
              })
              throw new Error("没事");
            }else{
              this.triggerEvent("setMan", {jian : 0,cha : 0 , totleJian : this.data.activity[index].discounts});
              this.setData({
                jian : 0 ,
                cha : 0,
              })
            }
          })
        }else{
          this.data.activity.forEach(item=>{
            if(item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice >0){
              this.triggerEvent("setMan", {jian : item.discounts.toFixed(2),cha : (item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice).toFixed(2),totleJian : item.discounts});
              this.setData({
                jian : item.discounts.toFixed(2) ,
                cha : (item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice).toFixed(2)
              })
              throw new Error("没事");
            }else{
              this.triggerEvent("setMan", {jian : 0,cha : 0, totleJian : item.discounts});
              this.setData({
                jian : 0 ,
                cha : 0,
              })
            }
          })
        }
      })
    },
    getPhoneNumber(e){
      console.log(e)
    },
    clearCar(){//清空购物车
      app.globalData.goodsInCar = []
      this.setData({
        goodsInCar : [],
        showCar : false
      },()=>{
        //调父组件方法
        let goodsInCar = this.data.goodsInCar;
        this.triggerEvent("getGoodsInCar", goodsInCar);
        this.triggerEvent("setGoodsArr", {goodsInCar});
      })
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
      this.setData({
        showCar : false
      },()=>{
        wx.navigateTo({
          url: '../submitOrder/submitOrder',
        })
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
        console.log(addDetail)
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
              this.triggerEvent("setMan", {jian : item.discounts.toFixed(2),cha : (item.conditions - app.globalData.msgOfCar.curPrice).toFixed(2),totleJian : index > 0 ? this.data.activity[index-1].discounts : 0});
              this.setData({
                jian : item.discounts.toFixed(2) ,
                cha : (item.conditions - app.globalData.msgOfCar.curPrice).toFixed(2)
              })
              throw new Error("没事");
            }else{
              this.triggerEvent("setMan", {jian : 0,cha : 0 , totleJian : this.data.activity[index].discounts});
              this.setData({
                jian : 0 ,
                cha : 0,
              })
            }
          })
        }else{
          this.data.activity.forEach(item=>{
            if(item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice >0){
              this.triggerEvent("setMan", {jian : item.discounts.toFixed(2),cha : (item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice).toFixed(2),totleJian : item.discounts});
              this.setData({
                jian : item.discounts.toFixed(2) ,
                cha : (item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice).toFixed(2)
              })
              throw new Error("没事");
            }else{
              this.triggerEvent("setMan", {jian : 0,cha : 0, totleJian : item.discounts});
              this.setData({
                jian : 0 ,
                cha : 0,
              })
            }
          })
        }
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
              this.triggerEvent("setMan", {jian : item.discounts.toFixed(2),cha : (item.conditions - app.globalData.msgOfCar.curPrice).toFixed(2),totleJian : index > 0 ? this.data.activity[index-1].discounts : 0});
              this.setData({
                jian : item.discounts.toFixed(2) ,
                cha : (item.conditions - app.globalData.msgOfCar.curPrice).toFixed(2)
              })
              throw new Error("没事");
            }else{
              this.triggerEvent("setMan", {jian : 0,cha : 0 , totleJian : this.data.activity[index].discounts});
              this.setData({
                jian : 0 ,
                cha : 0,
              })
            }
          })
        }else{
          this.data.activity.forEach(item=>{
            if(item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice >0){
              this.triggerEvent("setMan", {jian : item.discounts.toFixed(2),cha : (item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice).toFixed(2),totleJian : item.discounts});
              this.setData({
                jian : item.discounts.toFixed(2) ,
                cha : (item.conditions - app.globalData.msgOfCar.curPrice + this.data.actualPrice).toFixed(2)
              })
              throw new Error("没事");
            }else{
              this.triggerEvent("setMan", {jian : 0,cha : 0, totleJian : item.discounts});
              this.setData({
                jian : 0 ,
                cha : 0,
              })
            }
          })
        }
      })
      
    },
    checkCar(e){//已选商品
      if(app.globalData.goodsInCar.length == 0)return
      if(e){
        this.setData({
          addDetail : e
        })
      }
      this.setData({
        showCar :true,
        goodsInCar: app.globalData.goodsInCar,
        msgOfCar : app.globalData.msgOfCar
      })
    },
    selectOne(event,skuList){//选择规格
      let addDetail = JSON.parse(JSON.stringify(this.data.addDetail))
      addDetail.count =1
      let item = {}
      if(skuList){
        item = skuList
      }else{
        item = event.currentTarget.dataset
      }
      // const goodsInCar = JSON.parse(JSON.stringify(app.globalData.goodsInCar))
      // goodsInCar.forEach(i=>{
      //   if(i.skuId == item.item.skuId){
      //     addDetail.count = item.item.count ? item.item.count : 1
      //   }else{
      //     addDetail.count = 1
      //   }
      // })
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
      let addDetail = JSON.parse(JSON.stringify(this.data.addDetail))
      let count = this.data.count
      if(this.data.count>=1){
        // addDetail.count--
        count --
      }else{
        // addDetail.count = '0'
        count = '0'
      }
      this.setData({
        addDetail : addDetail,
        show :count == 0 ? false : true,
        count : count
      },()=>{
        if(count == 0){
          this.closeDialog()
        }
      })
    },
    closeDialog(){
      this.setData({
        count : 1
      })
    },
    addNum(){//加
      let addDetail = JSON.parse(JSON.stringify(this.data.addDetail))
      let count = this.data.count
      if(addDetail.count){
        // addDetail.count++
        count ++
      }else{
        // addDetail.count = 1
        count = 1
      }
      this.setData({
        addDetail : addDetail,
        count : count
      })
    },
  }
})
