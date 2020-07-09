// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const _ = cloud.database().command;

async function getActionList(coupleId, pageNo, pageSize) {
  // 现根据 coupleId 获取情侣 userId
  let userList = [];
  let tUser = cloud.database().collection('t_user');
  await tUser.where({"coupleId": coupleId}).get()
         .then(res => {userList = res.data});
  let userIdList = userList.map(item => item._id);
  let actionList = null;
  let tAction = cloud.database().collection('t_action');
  await tAction.where({"userId": _.in(userIdList)})
         .orderBy("timestamp", "desc")
         .skip((pageNo - 1) * pageSize)
         .limit(pageSize)
         .get()
         .then(res => {actionList = res.data;})
  return actionList;
}

async function initRelData(actionList) {
  // 构造 Map(type, relId[])，分组查询
  let map = new Map();
  for (let action of actionList) {
    if (!map.has(action.type)) {
      map.set(action.type, []);
    }
    map.get(action.type).push(action.relId);
  }
  // 查询结果封装 Map(type_relId, relData)
  let relDataMap = new Map();
  for (let entry of map.entries()) {
    let type = entry[0];
    let relIdList = entry[1];
    let relDataList = null;
    let tRel = cloud.database().collection(`t_${type}`);
    await tRel.where({"_id": _.in(relIdList)})
         .get()
         .then(res => {relDataList = res.data;})
    for (let relData of relDataList) {
      relDataMap.set(`${type}_${relData._id}`, relData);
    }
  }
  // 赋值
  for (let action of actionList) {
    let key = `${action.type}_${action.relId}`;
    action[action.type] = relDataMap.get(key);
  }
}

async function initRelUser (actionList) {
  let userMap = new Map();
  let userIdList = actionList.map(item => item.userId);
  let userIdSet = new Set(userIdList);
  let userList = null;
  let tUser = cloud.database().collection('t_user');
  await tUser.where({_id: _.in([...userIdSet])})
         .get()
         .then(res => {userList = res.data})
  userList.forEach(user => userMap.set(user._id, user));
  actionList.forEach(action => action["user"] = userMap.get(action.userId));
}

// 云函数入口函数
exports.main = async (event, context) => {
  // 1. 根据 coupleId 分页获取 actionList(type relId)
  let actionList = await getActionList(event.coupleId, event.pageNo, event.pageSize);
  console.log(actionList);
  if (!actionList || actionList.length == 0) {
    return null;
  }
  // 2. 渲染关联模块数据
  await initRelData(actionList);
  // 3. 渲染动态关联用户数据
  await initRelUser(actionList);
  return actionList;
}