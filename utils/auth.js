import api from './api'

const getAuthHeader = () => {
  return {
    openid: wx.getStorageSync('openid'),
    token: wx.getStorageSync('token'),
  }
}
const getLoginCode = () => {
  return new Promise((reslove) => {
    wx.login({
      success(res) {
        reslove(res.code);
      }
    })
  })
}

/**
 * 静默登录，同步方式
 */
const silentLogin = (loginCallBack) => {
  let { openid } = getAuthHeader();
  if (openid) {
    setGlobalUserData(loginCallBack);
    return;
  }
  getLoginCode()
    .then(code => {
      api.post({
        url: `/login?code=${code}`,
        success: (data) => {
          console.log("登录结果", data);
          if (!data) {
            loginCallBack();
            return;
          }
          wx.setStorageSync('openid', data.openid);
          wx.setStorageSync('token', data.token);
          setGlobalUserData(loginCallBack);
        }
      })
    });
}

/**
 * 获取当前用户信息并写入全局变量
 */
const setGlobalUserData = (success) => {
  let openid = wx.getStorageSync('openid');
  api.getUserData(openid, userData => {
    getApp().globalData.userData = userData;
    success && success(userData);
  })
}

const getGlobalUserData = () => {
  return getApp().globalData.userData;
}

const register = (request, success) => {
  getLoginCode()
    .then(code => {
      request.code = code;
      api.post({
        url: `/register`,
        data: request,
        success: (data) => {
          console.log("注册成功", data);
          wx.setStorageSync('openid', data.openid);
          wx.setStorageSync('token', data.token);
          setGlobalUserData(success);
        }
      })
    });
}

const loginCheck = () => {
  let userData = getGlobalUserData();
  if (userData && userData.user) {
    return userData;
  }
  wx.showModal({
    title: '提示',
    content: '检测到你还未注册',
    cancelText: '随便逛逛',
    confirmText: '现在注册',
    success(res) {
      if (res.confirm) {
        wx.navigateTo({
          url: "/pages/profile/profile"
        })
      }
    }
  })
}

const cpCheck = () => {
  let userData = loginCheck();
  if (!userData) {
    return null;
  }
  if (userData.userCp) {
    return userData.userCp;
  }
  wx.showModal({
    title: '提示',
    content: '检测到你还未邀请恋人',
    cancelText: '随便逛逛',
    confirmText: '现在邀请',
    success(res) {
      if (res.confirm) {
        wx.switchTab({
          url: "/pages/mine/mine"
        })
      }
    }
  })
}

export default {
  getAuthHeader,
  register,
  silentLogin,
  loginCheck,
  cpCheck,
  getGlobalUserData,
  setGlobalUserData,
}