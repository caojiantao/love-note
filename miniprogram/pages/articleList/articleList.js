const cloud = require("../../js/cloud.js");
const date = require("../../js/date.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 20,
    finish: false,
    actionList: []
  },
  /**
   * 下拉刷新
   */
  async onPullDownRefresh () {
    this.setData({
      pageNo: 1,
      finish: false,
    })
    await this.appendArticleList(true);
    wx.stopPullDownRefresh();
  },
  // 底部加载更多
  onReachBottom () {
    this.appendArticleList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.appendArticleList();
  },
  async appendArticleList (reset) {
    if (this.data.finish) {
      // 没有数据
      return;
    }
    wx.showNavigationBarLoading();
    let userId = getApp().globalData.userId;
    let user = await cloud.getById("t_user", userId);
    let articleList = await cloud.getByCondition({
      table: "t_article",
      where: {userId: userId},
      orderBy: {key: "timestamp", value: "desc"},
      page: {
        skip: (this.data.pageNo - 1) * this.data.pageSize,
        limit: this.data.pageSize
      }
    });
    this.setData({pageNo: this.data.pageNo + 1});
    wx.hideNavigationBarLoading();
    if (articleList && articleList.length > 0) {
      let actionList = articleList.map(article => {
        return {
          user: user,
          type: "article",
          article: article,
          timeFmt: date.timeFmt(article.timestamp)
        }
      });
      if (!reset) {
        actionList = this.data.actionList.concat(actionList);
      }
      this.setData({actionList: actionList})
    } else {
      this.setData({finish: true});
    }
  }
})