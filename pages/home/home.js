import auth from '../../utils/auth'
import api from '../../utils/api';

Page({
  data: {
    showReplyDialog: false,
    inviter: null,
    replyButtons: [{ text: '拒绝' }, { text: '同意' }],
    feedList: [
    ],
    feedQuery: {
      page: 1,
      size: 10,
    },
    feedFinish: false,
    menuBottom: getApp().globalData.menuBottom,
    userData: null,
  },
  onShow: function (options) {
    this.initUserData();
  },
  initUserData() {
    let userData = auth.getGlobalUserData();
    this.setData({
      "userData": userData
    })
  },
  onLoad: async function (options) {
    getApp().loginCallBack = (userData) => {
      if (auth.loginCheck()) {
        this.initUserData();
        this.doInvite(options);
      }
    }
    this.getTrendList();
  },
  async replyInviter(e) {
    // let agree = e.detail.index;
    let agree = e;
    if (!agree) {
      this.setData({
        showReplyDialog: false,
      })
      return;
    }

    api.post({
      url: `/agreeCp?inviterOpenid=${this.data.inviter.openid}`,
      success: data => {
        this.setData({
          showReplyDialog: false,
        })
      }
    })
  },

  async doInvite(options) {
    // let inviterOpenid = "oP2Gv6-jBvESJnaeT-Hdon_fSrbw";
    if (!options || !options.hasOwnProperty("inviter")) {
      // 没有邀请信息
      return;
    }
    let inviterOpenid = options["inviter"];

    let userData = auth.getGlobalUserData();

    let openid = userData.user.openid;
    if (inviterOpenid == openid) {
      // 自己不能跟自己组
      return;
    }

    if (userData.userCp) {
      // 自己已经组过CP了
      return;
    }

    api.getUserData(inviterOpenid, data => {
      if (data.userCp) {
        // 别人已经组过CP了
        return;
      }
      this.setData({
        showReplyDialog: true,
        inviter: data.user,
      })
      // todo cjt mp-dialog 修复后，不用这个
      wx.showModal({
        title: '提示',
        content: `${user.nickname}向你发来CP邀请`,
        cancelText: '拒绝',
        confirmText: '接受',
        success: (res) => {
          this.replyInviter(1);
        }
      })
    })
  },
  toAddTrend() {
    if (auth.cpCheck()) {
      wx.navigateTo({
        url: "/pages/add-trend/add-trend"
      });
    }
  },
  getTrendList(reset) {
    let query = this.data.feedQuery;
    if (reset) {
      query.page = 1;
    }
    api.get({
      url: `/getHomeFeedList?page=${query.page}&size=${query.size}`,
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