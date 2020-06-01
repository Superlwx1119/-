let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flower:[{text:'好评',img:'../images/goodFlowerEmpty.svg'},{text:'中评',img:'../images/badFlowersEmpty.svg'},{text:'差评',img:'../images/badFlowersEmpty.svg'}],
    goodStars:["../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg"],
    describeStars:["../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg"],
    sendStars:["../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg"],
    serveStars:["../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg"],
    orderId:'',
    fileList:[],
    imageList:[],
    orderInfo:{},
    comment:'',
    top:app.globalData.top,
    flowerIndex:0,
    reviewId:null,
    status: null
  },
  bindback(){
    wx.navigateTo({
      url: '../myComments/myComments',
    })
  },
  showBigImg(e){//放大图片
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.fileList[index], // 当前显示图片的http链接
      urls: this.data.fileList // 需要预览的图片http链接列表
    })
  },
  deleteImg(e){//删除图片
    let index = e.currentTarget.dataset.index
    let fileList = this.data.fileList
    let imageList = this.data.imageList
    fileList.splice(index,1)
    imageList.splice(index,1)
    this.setData({
      fileList : fileList,
      imageList : imageList
    })
  },
  getFlower(e){//给花评价
    let index = 0
    if(e.currentTarget){
      index = e.currentTarget.dataset.index
    }else{
      index = e
    }
    // console.log(Number(index))
    this.setData({
      flowerIndex : Number(index)
    })
  },
  selectPhoto(){//选择照片
    let arr = this.data.fileList
    let imageList = this.data.imageList
    let that = this;
    wx.chooseImage({
      count:5,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) =>{
        
        res.tempFilePaths.forEach(item=>{
          wx.showLoading({
            title: '上传中...',
            icon: 'loading',
            duration: 15000
          });
          wx.uploadFile({ 
						url: app.globalData.urlPath + '/file/file/upload',
						filePath: item, 
						name: 'file',
						formData: {
							'user': item
						}, 
						success: function (res) {
              res.data = JSON.parse(res.data)
              if(res.data.success){
                imageList.push(res.data.data[0])
                arr.push(item)
                that.setData({
                  fileList:arr,
                  imageList: imageList
                })
              }else{
                wx.showToast({
                  title: '上传失败!',
                  icon:'none',
                  duration : 1500
                })
              }
              wx.hideLoading();
						}
					});
        })
        
      },
    })
  },
  deleteComment(e){//删除
    app.toRequest('/review/reviewInfo/reviewAlterStatus',{
      "data": {
        "reviewId": this.data.reviewId,
        "status": 10
      },
    }).then(res=>{
      if(res.data.success){
        wx.showToast({
          title: '删除成功!',
          duration : 1500 ,
          success:()=>{
            wx.navigateBack({
              delta : 1
            })
          }
        })
      }
    })
    // wx.request({
    //   url: app.globalData.urlPath+'/review/reviewInfo/reviewAlterStatus',
    //   method:'POST',
    //   data:{
    //     "data": {
    //       "reviewId": this.data.reviewId,
    //       "status": 10
    //     },
    //   },
    //   success:res=>{
    //     if(res.data.success){
    //       wx.showToast({
    //         title: '删除成功!',
    //         duration : 1500 ,
    //         success:()=>{
    //           wx.navigateBack({
    //             delta : 1
    //           })
    //         }
    //       })
    //     }
        
    //   }
    // })
  },
  giveStars(e,typeE,indexE){//商品评价给星
    let index = 0
    if(typeE){
      index = typeE
    }else{
      index = e.currentTarget.dataset.index+1
    }
    let type = ''
    if(typeE){
      type = e
    }else{
      type = e.currentTarget.dataset.type
    }
    let arr = ["../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg","../images/starEmpty.svg"]

    for(let i=0;i<index;i++){
      arr.unshift("../images/starFill.svg")
      arr.splice(index,1)
    }
    switch (type){
      case 'goodStars':{
        this.setData({
          goodStars:arr,
        })
      };
      break;
      case 'describeStars':{
        this.setData({
          describeStars:arr,
        })
      };
      break;
      case 'sendStars':{
        this.setData({
          sendStars:arr,
        })
      };
      break;
      case 'serveStars':{
        this.setData({
          serveStars:arr,
        })
      };
    }
    
    
  },
  getOrderInfo(){//订单详情
    app.toRequest('/review/reviewInfo/reviewInfoOrder',{
      data:{
        orderId:this.data.orderId
      }
    }).then(res=>{
      res.data.data.imagePath = res.data.data.imagePath.split(',')[0]
      this.setData({
        orderInfo : res.data.data
      })
    })
    // wx.request({
    //   url: app.globalData.urlPath+'/review/reviewInfo/reviewInfoOrder',
    //   method:'POST',
    //   data:{
    //     data:{
    //       orderId:this.data.orderId
    //     }
    //   },
    //   success:res=>{
    //     res.data.data.imagePath = res.data.data.imagePath.split(',')[0]
    //     this.setData({
    //       orderInfo : res.data.data
    //     })
    //   }
    // })
  },
  toComment(e){
    this.setData({
      comment : e.detail.value
    })
  },
  reviewInfoSave(){//保存评价
    let that = this ;
    let goodStars = 0
    let describeStars = 0
    let sendStars = 0
    let serveStars = 0
    let arr = [ 'goodStars' , 'describeStars' , 'sendStars' , 'serveStars']
    arr.forEach(item=>{
      this.data[item].forEach(v=>{
        if(v.indexOf('Fill')>0){
          switch (item){
            case 'goodStars' : goodStars++;
            break;
            case 'describeStars' : describeStars++;
            break;
            case 'sendStars' : sendStars++;
            break;
            case 'serveStars' : serveStars++;
            break;
          }
        }
      })
    })
    let flowers = 0
    // if(!this.data.flowerIndex ){
    //   wx.showToast({
    //     title: '请对商品进行评价!',
    //     icon:'none',
    //     duration:1500
    //   })
    //   return
    // }else{
    //   switch (this.data.flowerIndex){
    //     case 0 : flowers = 50 ;
    //     break;
    //     case 1 : flowers = 30 ;
    //     break;
    //     case 2 : flowers = 10 ;
    //     break;
    //   }
    // }
    switch (this.data.flowerIndex){
      case 0 : flowers = 50 ;
      break;
      case 1 : flowers = 30 ;
      break;
      case 2 : flowers = 10 ;
      break;
    }
    if(describeStars == 0 || sendStars == 0 || serveStars == 0){
      wx.showToast({
        title: '店铺评价未填写完整!',
        icon:"none",
        duration :1500
      })
      return
    }
    
    wx.getStorage({
      key: 'customerId',
      success:res=>{
        app.toRequest('/review/reviewInfo/reviewInfoSave',{
          "data": {
            "customerId": res.data,
            "describeLevel": describeStars*10,
            "distributionLevel": sendStars*10,
            "goodsLevel": flowers,
            "imagePath": that.data.imageList.toString(),
            "orderId": that.data.orderId,
            "reviewContent": that.data.comment,
            "serverLevel": serveStars*10,
            "shopId": app.globalData.shopId
          },
        }).then(res=>{
          if(res.data.resultCode == 1){
            wx.showToast({
              title: '评价成功!',
              duration : 1500
            })
            wx.redirectTo({
              url: '../myComments/myComments',
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
        //   url: app.globalData.urlPath+'/review/reviewInfo/reviewInfoSave',
        //   method:'POST',
        //   data:{
        //     "data": {
        //       "customerId": res.data,
        //       "describeLevel": describeStars*10,
        //       "distributionLevel": sendStars*10,
        //       "goodsLevel": flowers,
        //       "imagePath": that.data.imageList.toString(),
        //       "orderId": that.data.orderId,
        //       "reviewContent": that.data.comment,
        //       "serverLevel": serveStars*10,
        //       "shopId": app.globalData.shopId
        //     },
        //   },
        //   success:res=>{
        //     if(res.data.resultCode == 1){
        //       wx.showToast({
        //         title: '评价成功!',
        //         duration : 1500
        //       })
        //       wx.redirectTo({
        //         url: '../myComments/myComments',
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
      }
    })
    
  },
  getCommentInfo(){//评价详情
    app.toRequest('/review/reviewInfo/reviewInfoDetail',{
      data:{
        reviewId: this.data.reviewId,
        orderId : this.data.orderId
      }
    }).then(res=>{
      if(res.data.success && res.data.data){
        let arr = [{lable:'describeStars',value:res.data.data.describeLevel/10},{lable:'sendStars',value:res.data.data.distributionLevel/10},{lable:'serveStars',value:res.data.data.serverLevel/10}]
        arr.forEach(item=>{
          this.giveStars(item.lable,item.value)
        })
        let goodsLevel = 0 
        switch (res.data.data.goodsLevel){
          case 50 :goodsLevel = 0;
          break;
          case 30 : goodsLevel = 1;
          break;
          case 10 : goodsLevel = 2;
        }
        this.getFlower(goodsLevel)
        this.setData({
          comment : res.data.data.reviewContent,
          status : res.data.data.status,
          fileList : res.data.data.imagePath.split(',')
        })
      }
    })
    // wx.request({
    //   url: app.globalData.urlPath+'/review/reviewInfo/reviewInfoDetail',
    //   method:'POST',
    //   data:{
    //     data:{
    //       reviewId: this.data.reviewId,
    //       orderId : this.data.orderId
    //     }
    //   },
    //   success:res=>{
    //     if(res.data.success && res.data.data){
    //       let arr = [{lable:'describeStars',value:res.data.data.describeLevel/10},{lable:'sendStars',value:res.data.data.distributionLevel/10},{lable:'serveStars',value:res.data.data.serverLevel/10}]
    //       arr.forEach(item=>{
    //         this.giveStars(item.lable,item.value)
    //       })
    //       let goodsLevel = 0 
    //       switch (res.data.data.goodsLevel){
    //         case 50 :goodsLevel = 0;
    //         break;
    //         case 30 : goodsLevel = 1;
    //         break;
    //         case 10 : goodsLevel = 2;
    //       }
    //       this.getFlower(goodsLevel)
    //       this.setData({
    //         comment : res.data.data.reviewContent,
    //         status : res.data.data.status,
    //         fileList : res.data.data.imagePath.split(',')
    //       })
    //     }
    //     // this.setData({
    //     //   orderInfo : res.data.data
    //     // })
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId : options.orderId,
      reviewId : options.reviewId
    },()=>{
      this.getOrderInfo()
      this.getCommentInfo() 
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.reLaunch({
    //   url: '../myComments/myComments'
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