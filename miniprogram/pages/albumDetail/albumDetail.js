const cloud = require("../../js/cloud.js");
const auth = require("../../js/auth.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    album: {},
    albumImageList: [],
    toDeleteImageId: null,
    sheetShow: false,
    sheetList: [{text: "删除", value: 1}],
  },
  onLoad: async function (options) {
    wx.showNavigationBarLoading();
    await this.getAlbum();
    await this.getAlbumImageList();
    wx.hideNavigationBarLoading();
  },
  getAlbumId () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    return currentPage.options.albumId;
  },
  getAlbum () {
    let albumId = this.getAlbumId();
    return cloud.getById("t_album", albumId).then(album => {
      this.setData({album: album});
    });
  },
  getAlbumImageList () {
    let albumId = this.getAlbumId();
    return cloud.getByCondition({
      table: "t_album_image",
      where: {"albumId": albumId},
      orderBy: {key: "timestamp", value: "desc"}
    }).then(albumImageList => {
      this.setData({albumImageList: albumImageList})
    })
  },
  async uploadAlbumImageList (filePathList) {
    let albumId = this.data.album._id;
    // 批量上传
    wx.showLoading({
      title: '上传中',
    })
    cloud.uploadFileList(filePathList).then(fileIdList => {
      let user = auth.getUser();
      return wx.cloud.callFunction({
        name: "uploadImage",
        data: {
          albumId: albumId,
          coupleId: user.coupleId,
          userId: user._id,
          fileIdList: fileIdList
        }
      })
    }).then(res => {
      return this.getAlbumImageList();
    }).then(res => {
      wx.hideLoading();
    });
  },
  chooseImage () {
    let _this = this;
    wx.chooseImage({
      success: function(res) {
        let filePathList = res.tempFilePaths;
        _this.uploadAlbumImageList(filePathList);
      }
    })
  },
  preview (event) {
    let src = event.currentTarget.dataset.src;
    let urls = this.data.albumImageList.map(albumImage => albumImage.fileId);
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  showSheet (event) {
    this.setData({
      toDeleteImageId: event.currentTarget.dataset.id,
      sheetShow: true
    });
  },
  sheetClick (event) {
    this.setData({sheetShow: false});
    let value = event.detail.value;
    if (value == 1) {
      // 删除
      this.removeAlbumImage();
    }
  },
  removeAlbumImage () {
    let _this = this;
    wx.showModal({
      content: '确认删除这张照片吗？',
      success (res) {
        if (res.confirm) {
          wx.showNavigationBarLoading();
          let albumImageId = _this.data.toDeleteImageId;
          wx.cloud.callFunction({
            name: "removeImage",
            data: {
              albumImageId: albumImageId
            }
          }).then(() => {
            wx.hideNavigationBarLoading();
            _this.setData({
              toDeleteImageId: null,
              sheetShow: false
            });
            _this.getAlbumImageList();
          });
        }
      }
    })
  }
})