const md5 = require('md5.js');
const auth = require('auth.js');

const getById = async (table, id) => {
  let t = wx.cloud.database().collection(table);
  let result = null;
  await t.doc(id).get().then(res => result = res.data).catch(() => {});
  return result;
}

const getByCondition = async (option) => {
  // 定位数据表
  let table = option.table;
  let t = wx.cloud.database().collection(table);
  let result = null;
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
  await query.get().then(res => result = res.data).catch(() => {});
  if (option.onlyOne && result && result.length > 0) {
    return result[0];
  }
  return result;
}

const uploadFile = async (filePath) => {
  if (!filePath) {
    return;
  }
  let suffix = filePath.substring(filePath.lastIndexOf("."), filePath.length);
  let newName = md5.hexMD5(auth.getUser()._id + filePath + new Date().getTime());
  let fileId = null;
  await wx.cloud.uploadFile({
    cloudPath: `${newName}.${suffix}`,
    filePath: filePath
  }).then(res => {fileId = res.fileID});
  return fileId;
}

module.exports = {
  getById: getById,
  getByCondition: getByCondition,
  uploadFile: uploadFile
}