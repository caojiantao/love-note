const cloud = require("../../js/cloud.js");
const auth = require("../../js/auth.js");

Page({
  data: {
    submiting: false,
    tmpCover: "",
    album: {
      title: "",
      cover: "",
      timestamp: null,
    }
  },
  titleInputChange (e) {
    let album = this.data.album;
    album.title = e.detail.value;
    this.setData({album: album});
  },
  async saveAlbum (e) {
    let tmpCover = this.data.tmpCover;
    if (!tmpCover) {
      wx.showToast({
        title: '必须设置相册封面',
        icon: 'none'
      });
      return;
    }

    this.setData({submiting: true});
    wx.showLoading({
      title: '处理中...',
    })
    // 先上传图片获取返回地址
    let fileId = await cloud.uploadFile(tmpCover);
    let album = this.data.album;
    album.cover = fileId;
    let user = auth.getUser();
    album.coupleId = user.coupleId;
    album.userId = user._id;
    album.timestamp = new Date().getTime();
    await cloud.add("t_album", album);
    wx.hideLoading();
    wx.navigateBack();
  },
  setCover () {
    wx.chooseImage({
      count: 1,
      success: res => {
        let filePath = res.tempFilePaths[0];
        this.setData({tmpCover: filePath});
      }
    })
  }
})