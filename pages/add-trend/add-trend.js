import api from '../../utils/api'

Page({
  data: {
    content: "",
    images: [],
    showAddImage: true,
    disabledAdd: true,
  },
  addImage: function () {
    wx.chooseMedia({
      count: 9 - this.data.images.length,
      mediaType: ["image"],
      success: (res) => {
        let images = res.tempFiles.map(({ tempFilePath }) => (tempFilePath))
        this.setData({
          images: [...this.data.images, ...images],
        })
        this.resetDisabledAdd();
      }
    })
  },
  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: this.data.images,
    })
  },
  setTrendContent(e) {
    this.setData({
      content: e.detail.value
    })
    this.resetDisabledAdd();
  },
  async addTrend(e) {
    wx.showLoading();
    let trend = {};
    trend.content = this.data.content;
    trend.mediaList = [];
    for (let image of this.data.images) {
      let url = await api.uploadImageSync(image);
      trend.mediaList.push({
        type: 'IMAGE',
        image: {
          url: url
        }
      })
    }
    api.post({
      url: '/addTrend',
      data: trend,
      success: data => {
        let pages = getCurrentPages();
        pages[pages.length - 2].onPullDownRefresh();
        wx.hideLoading();
        wx.navigateBack();
      }
    });
  },
  showDeleteMenu(e) {
    wx.showActionSheet({
      itemList: ['删除'],
      success: (res) => {
        if (res.tapIndex == 0) {  // 用户点击了删除按钮
          let images = this.data.images;
          images.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            images: images,
          })
          this.resetDisabledAdd();
        }
      }
    });
  },
  resetDisabledAdd() {
    let content = this.data.content;
    let images = this.data.images;
    this.setData({
      disabledAdd: content.length == 0 && images.length == 0,
      showAddImage: images.length < 9
    })
  }
})