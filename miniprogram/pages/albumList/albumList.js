const cloud = require("../../js/cloud.js");
const auth = require("../../js/auth.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumList: [],
    toDeleteAlbumId: null,
    sheetShow: false,
    sheetList: [{text: "删除", value: 1}],
  },
  async onLoad () {
    this.getAlbumList();
  },
  async getAlbumList () {
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
  },
  toDetail (event) {
    let albumId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/albumDetail/albumDetail?albumId=${albumId}`,
    })
  },
  showSheet (event) {
    this.setData({
      toDeleteAlbumId: event.currentTarget.dataset.id,
      sheetShow: true
    });
  },
  sheetClick (event) {
    this.setData({sheetShow: false});
    let value = event.detail.value;
    if (value == 1) {
      // 删除
      this.removeAlbum();
    }
  },
  removeAlbum () {
    let _this = this;
    wx.showModal({
      content: '确认删除这个相册吗？',
      success (res) {
        if (res.confirm) {
          wx.showNavigationBarLoading();
          wx.cloud.callFunction({
            name: "removeAlbum",
            data: {
              albumId: _this.data.toDeleteAlbumId
            }
          }).then(() => {
            wx.hideNavigationBarLoading();
            _this.setData({
              toDeleteAlbumId: null,
              sheetShow: false
            });
            _this.getAlbumList();
          });
        }
      }
    })
  }
})