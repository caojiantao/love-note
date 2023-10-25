let app = getApp();
let top = app.globalData.menuTop;
let bottom = app.globalData.menuGap;
let padding = `${top}px 0px ${bottom}px 0px`;

// components/nav/nav.js
Component({
  options: {
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    title: "",
  },

  /**
   * 组件的初始数据
   */
  data: {
    menuHeight: app.globalData.menuHeight,
    menuLeft2: app.globalData.menuLeft2,
    menuGap: app.globalData.menuGap,
    padding: padding,
  },

  /**
   * 组件的方法列表
   */
  methods: {
  }
})