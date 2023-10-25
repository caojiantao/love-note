import auth from './utils/auth'

// app.js
App({
  onLaunch() {
    this.initCustomNav();
    // 启动时静默登录
    auth.silentLogin(userData => {
      let callback = this.loginCallBack;
      callback && callback(userData);
    });
  },
  globalData: {
    userData: null
  },
  initCustomNav() {
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    let systemInfo = wx.getSystemInfoSync();
    //导航高度
    this.globalData.menuHeight = menuButtonObject.height;
    this.globalData.menuTop = menuButtonObject.top;
    this.globalData.menuRight = menuButtonObject.right;
    this.globalData.menuBottom = menuButtonObject.bottom;
    this.globalData.menuLeft = menuButtonObject.left;
    this.globalData.menuGap = systemInfo.windowWidth - menuButtonObject.right;
    // 胶囊左侧离右边的距离
    this.globalData.menuLeft2 = systemInfo.windowWidth - menuButtonObject.left;
    // 胶囊上侧离状态栏的距离
    this.globalData.menuTop2 = menuButtonObject.top - systemInfo.statusBarHeight;
  }
})
