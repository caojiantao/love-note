const utils = require("../../js/utils.js")

Page({
  data: {
    param: null
  },
  onLoad (options) {
    let param = utils.getParamFromObj(options);
    this.setData({param: param});
  },
  getUserInfo (e) {
    let user = e.detail.userInfo;
    // 调用云函数
    wx.cloud.callFunction({
      name: "authorize",
      data: {
        user: user
      }
    }).then(res => {
      // 设置全名变量
      getApp().globalData.userId = res.result;
      // 重定向首页
      wx.switchTab({
        url: `/pages/home/home?${this.data.param}`,
      })
    })
  }
})