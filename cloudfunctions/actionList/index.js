// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'pro-b2c3z',
})

const _ = cloud.database().command;

async function getActionList(coupleId, pageNo, pageSize) {
  let actionList = null;
  let tAction = cloud.database().collection('t_action');
  await tAction.where({"coupleId": coupleId})
         .orderBy("timestamp", "desc")
         .skip((pageNo - 1) * pageSize)
         .limit(pageSize)
         .get()
         .then(res => {actionList = res.data;})
  return actionList;
}

async function initRelData(actionList) {
  let taskList = [];  
  actionList.forEach(action => {
    let type = action.type;
    let tRelTable = cloud.database().collection(`t_${type}`);
    let task;
    if (action.multi) {
      // 关联多项数据，例如上传的相册图片列表
      task = tRelTable.where({
        "_id": _.in(action.refIdList)
      }).get().then(res => {
        action[type] = res.data;
      })
    } else {
      // 关联单项，例如发表心事，创建相册
      task = tRelTable.doc(action.refId).get().then(res => {
        action[type] = res.data;
      });
    }
    taskList.push(task);
  })
  await Promise.all(taskList);
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
  // 1. 根据 coupleId 分页获取 actionList(type refId)
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