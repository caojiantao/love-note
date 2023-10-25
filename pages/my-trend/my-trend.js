import api from '../../utils/api';
import auth from '../../utils/auth';

Page({
  data: {
    feedList: [
    ],
    feedQuery: {
      page: 1,
      size: 10,
    },
    feedFinish: false,
    userCp: null,
  },
  onLoad: async function (options) {
    let userData = auth.getGlobalUserData();
    if (userData) {
      this.setData({
        userCp: userData.userCp
      })
    }
    this.getTrendList();
  },
  getTrendList(reset) {
    if (!this.data.userCp) {
      wx.showModal({
        title: '提示',
        content: '先去邀请您的恋人~',
        showCancel: false,
        complete: (res) => {
          if (res.confirm) {
            wx.navigateBack();
          }
        }
      })
      return;
    }
    let query = this.data.feedQuery;
    if (reset) {
      query.page = 1;
    }
    api.get({
      url: `/getHomeFeedList?page=${query.page}&size=${query.size}&cpId=${this.data.userCp.id}`,
      success: data => {
        let feedList = reset ? [] : this.data.feedList;
        let feedQuery = this.data.feedQuery;
        feedQuery.page++;
        this.setData({
          feedList: [...feedList, ...data],
          feedQuery: feedQuery,
          feedFinish: reset ? false : (data.length == 0),
        })
      },
      complete: () => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  onPullDownRefresh() {
    this.getTrendList(true);
  },
  onReachBottom() {
    if (this.data.feedFinish) {
      return;
    }
    this.getTrendList(false);
  }
})