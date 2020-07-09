Page({

  /**
   * 页面的初始数据
   */
  data: {
    submiting: false
  },
  articleSave (e) {
    this.setData({submiting: true});
    let userId = getApp().globalData.userId;
    let article = e.detail.value;
    wx.cloud.callFunction({
      name: "articleSave",
      data: {
        article: {
          userId: userId,
          content: article.content,
          timestamp: new Date().getTime()
        }
      }
    }).then(() => {
      this.setData({submiting: true});
      wx.navigateBack();
    });
  }
})