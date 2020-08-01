const auth = require("../../js/auth.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    submiting: false
  },
  articleSave (e) {
    this.setData({submiting: true});
    let user = auth.getUser();
    let article = e.detail.value;
    wx.cloud.callFunction({
      name: "articleSave",
      data: {
        article: {
          userId: user._id,
          coupleId: user.coupleId,
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