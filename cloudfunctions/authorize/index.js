// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'pro-b2c3z',
})

// 云函数入口函数
exports.main = async (event, context) => {
  let openid = cloud.getWXContext().OPENID;
  let matchUser;
  let tUser = cloud.database().collection('t_user');
  // 查询是否存在记录
  await tUser.where({
    openid: openid
  }).get().then(res => {
    matchUser = res.data;
  });
  if (matchUser && matchUser.length > 0) {
    // 匹配直接返回
    return matchUser[0];
  }
  // 没有匹配记录则插入
  let user = event.user;
  if (!user) {
    // 没有基础信息不自动插入
    return null;
  }
  user.openid = openid;
  user.timestamp = new Date().getTime();
  // 插库注册
  await tUser.add({
    data: user
  }).then(res => {
    user._id = res._id;
  });
  return user;
}