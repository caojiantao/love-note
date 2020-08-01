const auth = require("../../js/auth.js")
const cloud = require("../../js/cloud.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    partner: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const _ = wx.cloud.database().command;
    await auth.checkLogin(options);
    let userInfo = auth.getUser();
    this.setData({userInfo: userInfo});
    // 初始化老伴信息
    if (!userInfo.coupleId) {
      return;
    }
    let partner =  await cloud.getByCondition({
      table: "t_user",
      where: {
        _id: _.neq(userInfo._id),
        coupleId: userInfo.coupleId
      },
      onlyOne: true
    });
    this.setData({partner: partner});
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

  },
  toInvite () {
    wx.navigateTo({
      url: '/pages/invite/invite',
    })
  }
})