const auth = require("../../js/auth.js")
const cloud = require("../../js/cloud.js")
const date = require("../../js/date.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionList: [],
    pageNo: 1,
    pageSize: 10
  },
  async onLoad (options) {
    // 校验登录信息
    await auth.checkLogin(options);
    // 校验是否是被邀请组 CP
    await this.checkIfInvite(options);
    this.appendActionList();
  },
  async onPullDownRefresh () {
    this.setData({
      pageNo: 1,
      finish: false,
    })
    await this.appendActionList(true);
    wx.stopPullDownRefresh();
  },
  // 底部加载更多
  onReachBottom () {
    this.appendActionList();
  },
  async checkIfInvite (options) {
    if (!options.hasOwnProperty("inviteId")) {
      // 没有邀请信息
      return;
    }
    // 尝试组 CP
    let coupleId = null;
    await wx.cloud.callFunction({
      name: "saveCouple",
      data: {
        myId: auth.getUserId(),
        inviteId: options["inviteId"]
      },
    }).then(res => coupleId = res.result);
    if (coupleId) {
      wx.showToast({
        title: "CP 成功",
      })
    }
  },
  async appendActionList (reset) {
    if (this.data.finish) {
      // 没有数据
      return;
    }
    wx.showNavigationBarLoading();
    let userId = auth.getUser()._id;
    let user = await cloud.getById("t_user", userId);
    let actionList = null;
    await wx.cloud.callFunction({
      name: "actionList",
      data: {
        coupleId: user.coupleId,
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize
      }
    }).then(res => actionList = res.result);
    wx.hideNavigationBarLoading();
    if (!reset) {
      actionList = this.data.actionList.concat(actionList);
    }
    if (actionList && actionList.length > 0) {
      // 日期格式化
      actionList.forEach(action => {
        action["timeFmt"] = date.timeFmt(action.timestamp);
      })
    } else {
      this.setData({finish: true});
    }
    this.setData({
      actionList: actionList,
      pageNo: this.data.pageNo + 1
    });
  }
})