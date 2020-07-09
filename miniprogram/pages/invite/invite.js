const auth = require("../../js/auth.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    description: "1. 恋爱记事本是一款记录情侣间日常生活的小程序，旨在更好地捕捉每个感情瞬间；\n2. 每次情绪的变化，不妨写点心事，出门游玩，记得上传相册，不要忘了你们的“感情里程碑”；\n3. 还在等什么，赶快去邀请 TA 吧；"
  },
  onShareAppMessage: function () {
    let userId = auth.getUser()._id;
    return {
      title: "余生请你 多多指教",
      path: `/pages/home/home?inviteId=${userId}`,
      imageUrl: "/images/invite.jpeg"
    }
  }
})