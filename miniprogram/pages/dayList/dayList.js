const cloud = require("../../js/cloud.js");
const auth = require("../../js/auth.js");

Page({
  data: {
    pageNo: 1,
    pageSize: 20,
    finish: false,
    dayList: [],
    // 后期赋值
    slideButtons: [{
      text: '编辑',
      data: {
        id: 1
      }
    }, {
      type: 'warn',
      text: '删除',
    }],
  },
  onLoad: function (options) {
    wx.startPullDownRefresh();
  },
  async onPullDownRefresh () {
    this.setData({
      pageNo: 1,
      finish: false,
    })
    await this.appendDayList(true);
    wx.stopPullDownRefresh();
  },
  async appendDayList (reset) {
    if (this.data.finish) {
      return;
    }
    wx.showNavigationBarLoading();
    let user = auth.getUser();
    let dayList = await cloud.getByCondition({
      table: "t_day",
      where: {coupleId: user.coupleId},
      orderBy: {key: "timestamp", value: "desc"},
      page: {
        skip: (this.data.pageNo - 1) * this.data.pageSize,
        limit: this.data.pageSize
      }
    });
    this.setData({pageNo: this.data.pageNo + 1});
    wx.hideNavigationBarLoading();
    if (!dayList || dayList.length == 0) {
      this.setData({finish: true});
    }
    // 追加还是重置
    if (!reset) {
      dayList = this.data.dayList.concat(dayList);
    }
    this.setData({dayList: dayList})
  },
  slideButtonTap(e) {
    let index = e.detail.index;
    let data = e.detail.data;
    switch (index) {
      case 0:
        // 删除
        this.removeDay(data._id);
        break;
    }
  },
  removeDay (dayId) {
    let _this = this;
    wx.showModal({
      content: '确认删除这个纪恋日吗？',
      success (res) {
        if (res.confirm) {
          wx.showNavigationBarLoading();
          wx.cloud.callFunction({
            name: "removeDay",
            data: {
              dayId: dayId
            }
          }).then(() => {
            wx.hideNavigationBarLoading();
            _this.startPullDownRefresh();
          });
        }
      }
    })
  }
})