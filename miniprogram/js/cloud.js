const md5 = require('md5.js');
const auth = require('auth.js');

const getById = (table, id) => {
  let t = wx.cloud.database().collection(table);
  return t.doc(id).get().then(res => {return res.data});
}

const getByCondition = (option) => {
  // 定位数据表
  let table = option.table;
  let t = wx.cloud.database().collection(table);
  // 查询条件
  let where = option.where;
  let query = t.where(where);
  // 排序
  let orderBy = option.orderBy;
  if (orderBy) {
    query = query.orderBy(orderBy.key, orderBy.value);
  }
  // 分页
  let page = option.page;
  if (page) {
    query = query.skip(page.skip).limit(page.limit);
  }
  return query.get().then(res => {
    let result = res.data;
    if (option.onlyOne && result && result.length > 0) {
      // 单查
      return result[0];
    }
    return result;
  });
}

const add = (table, data) => {
  let t = wx.cloud.database().collection(table);
  return t.add({
    data: data
  });
}

const remove = (table, id) => {
  let t = wx.cloud.database().collection(table);
  return t.doc(id).remove();
}

const uploadFile = (filePath) => {
  if (!filePath) {
    return;
  }
  let suffix = filePath.substring(filePath.lastIndexOf("."), filePath.length);
  let newName = md5.hexMD5(auth.getUser()._id + filePath + new Date().getTime());
  return wx.cloud.uploadFile({
    cloudPath: `${newName}.${suffix}`,
    filePath: filePath
  }).then(res => {return res.fileID});
}

const uploadFileList = (filePathList) => {
  if (!filePathList || filePathList.length == 0) {
    return;
  }
  let taskList = [];
  filePathList.forEach(filePath => {
    let task = uploadFile(filePath);
    taskList.push(task);
  });
  return Promise.all(taskList).then(fileIdList => {
    return fileIdList;
  });
}

module.exports = {
  getById: getById,
  getByCondition: getByCondition,
  add: add,
  remove: remove,
  uploadFile: uploadFile,
  uploadFileList: uploadFileList
}