import auth from '../../utils/auth'
import util from '../../utils/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    userCp: null,
    useruserPartner: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.initUserData();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return util.getShareParam();
  },
  initUserData() {
    let userData = auth.getGlobalUserData();
    this.setData(userData)
  }
})