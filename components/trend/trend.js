import util from '../../utils/util'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    trend: {}
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    previewImage(e) {
      let urls = this.data.trend.mediaList.map(media => media.image.url);
      wx.previewImage({
        current: e.target.dataset.src,
        urls: urls,
      })
    },
  },
})
