import auth from './auth'

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const getConfig = () => {
  const accountInfo = wx.getAccountInfoSync();
  const env = accountInfo.miniProgram.envVersion;
  const { config } = require(`../config/config`);
  // fixme 不明白这种引入为什么就报错
  // const { config } = require(`../config/config-${env}`);
  return config;
}

const getShareParam = ()=> {
  let userData = auth.getGlobalUserData();
  let canInvite = userData && userData.user && !userData.userCp;
  if (canInvite) {
    return {
      title: "余生请你 多多指教❤",
      path: `/pages/home/home?inviter=${userData.user.openid}`,
      imageUrl: "/images/logo.png"
    }
  } else {
    return {
      title: "快来恋人记事本吃瓜",
      path: `/pages/home/home`,
      imageUrl: "/images/logo.png"
    }
  }}

module.exports = {
  formatTime,
  getConfig,
  getShareParam,
}
