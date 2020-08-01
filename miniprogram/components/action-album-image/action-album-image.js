const cloud = require("../../js/cloud.js");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    albumImage: null
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached () {
    let albumId = this.data.albumImage[0].albumId;
    cloud.getById("t_album", albumId).then(album => {
      this.setData({album: album});
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toDetail (event) {
      let albumId = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/albumDetail/albumDetail?albumId=${albumId}`,
      })
    },
    preview (event) {
      let src = event.currentTarget.dataset.src;
      let urls = this.data.albumImage.map(albumImage => albumImage.fileId);
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    }
  }
})
