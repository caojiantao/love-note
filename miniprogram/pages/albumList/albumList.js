const cloud = require("../../js/cloud.js");
const auth = require("../../js/auth.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumList: []
  },
  async onLoad () {
    let user = auth.getUser();
    let albumList = await cloud.getByCondition({
      table: "t_album",
      where: {
        coupleId: user.coupleId
      },
      orderBy: {key: "timestamp", value: "desc"}
    });
    this.setData({albumList: albumList});
  },
  toAlbumSave () {
    wx.navigateTo({
      url: '/pages/albumSave/albumSave',
    })
  }
})