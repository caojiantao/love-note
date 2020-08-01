const utils = require("./utils.js")

const checkLogin = async (options) => {
  let user = getApp().globalData.user;
  if (!user) {
    // 没有登录态 则尝试获取
    let user = await wx.cloud.callFunction({
      name: "authorize",
    }).then(res => res.result);
    if (user) {
      getApp().globalData.user = user;
    } else {
      // 获取不到说明未授权过
      let param = utils.getParamFromObj(options);
      wx.redirectTo({
        url: `/pages/authorize/authorize?${param}`,
      })
    }
  }
  return user;
}

const getUser = () => {
  return getApp().globalData.user;
}

const setUser = user => {
  getApp().globalData.user = user;
}

module.exports = {
  checkLogin: checkLogin,
  getUser: getUser,
  setUser: setUser
}
