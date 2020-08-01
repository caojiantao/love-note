// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'pro-b2c3z',
})

async function checkValidUserId(myId, inviteId) {
  console.log(myId, inviteId);
  if (myId == inviteId) {
    // 自己不能邀请自己
    return false;
  }
  let tUser = cloud.database().collection("t_user");
  let partner = null;
  await tUser.doc(inviteId).get().then(res => partner = res.data);
  if (!partner) {
    // 邀请人不存在
    return false;
  }
  let myself = null;
  await tUser.doc(myId).get().then(res => myself = res.data);
  if (partner.coupleId || myself.coupleId) {
    // 双方中存在某位已经组了 CP
    return false;
  }
  return true;
}

async function addCouple(myId, inviteId) {
  // 先创建 CP，返回 id
  let tCouple = cloud.database().collection("t_couple");
  let coupleId = null;
  await tCouple.add({
    data: {
      timestamp: new Date().getTime()
    }
  }).then(res => {coupleId = res._id});
  // 分别修改两个用户关联的 CP ID
  let tUser = cloud.database().collection("t_user");
  const _ = cloud.database().command;
  console.log(coupleId);
  await tUser.where({
    _id: _.in([myId, inviteId])
  }).update({
    data: {coupleId: coupleId}
  });
  return coupleId;
}

// 云函数入口函数
exports.main = async (event, context) => {
  let myId = event.myId;
  let inviteId = event.inviteId;
  // 校验合法性
  let valid = await checkValidUserId(myId, inviteId);
  if (!valid) {
    return;
  }
  // 创建 CP
  let coupleId = await addCouple(myId, inviteId);
  return coupleId;
}