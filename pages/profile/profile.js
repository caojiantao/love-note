import api from "../../utils/api"
import auth from "../../utils/auth"

const anonymousAvatarUrl = "/images/anonymous.png";

// pages/profile/profile.js
Page({
  data: {
    genderPickData: [
      { id: 1, name: "男" },
      { id: 2, name: "女" },
    ],
    genderPickIndex: 0,
    avatarUrl: anonymousAvatarUrl,
    nickname: "",
  },
  onLoad() {
    let userData = auth.getGlobalUserData();
    let user = userData.user;
    if (!user) {
      return;
    }
    let genderPickIndex = 0;
    for (genderPickIndex in this.data.genderPickData) {
      if (this.data.genderPickData[genderPickIndex].id == user.gender) {
        break;
      }
    }
    this.setData({
      avatarUrl: user.avatarUrl,
      nickname: user.nickname,
      genderPickIndex: genderPickIndex,
    })
  },
  async onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    let url = await api.uploadImageSync(avatarUrl);
    this.setData({
      avatarUrl: url
    })
  },
  saveUserProfile() {
    wx.showLoading();
    if (auth.getGlobalUserData()) {
      this.updateUser();
    } else {
      this.registerUser();
    }
  },
  registerUser() {
    let gender = this.data.genderPickData[this.data.genderPickIndex].id;
    auth.register({
      avatarUrl: this.data.avatarUrl,
      nickname: this.data.nickname,
      gender: gender,
    }, data => {
      console.log("注册用户成功", data);
      auth.setGlobalUserData(() => {
        wx.hideLoading();
        wx.navigateBack();
      });
    })
  },
  updateUser() {
    let gender = this.data.genderPickData[this.data.genderPickIndex].id;
    api.post({
      url: "/saveUser",
      data: {
        avatarUrl: this.data.avatarUrl,
        nickname: this.data.nickname,
        gender: gender,
      },
      success: data => {
        console.log("更新用户成功", data);
        auth.setGlobalUserData(() => {
          wx.hideLoading();
          wx.navigateBack();
        });
      }
    })
  },
  bindNicknameChange(e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  bindGenderPickerChange(e) {
    this.setData({
      genderPickIndex: e.detail.value
    })
  }
})