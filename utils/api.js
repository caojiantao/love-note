import auth from './auth'
import util from './util'

const request = (param) => {
  let authHeader = { "header": auth.getAuthHeader() };
  Object.assign(param, authHeader);
  let success = param.success;
  param.success = (res) => {
    let result = res.data;
    if (result.code != 0) {
      console.log(res);
      wx.showToast({
        title: result.msg,
        icon: 'error',
      })
    } else {
      success(result.data);
    }
  }
  let apiUrlPrefix = util.getConfig().apiUrlPrefix;
  param.url = apiUrlPrefix + param.url;
  // wx.showLoading({
  //   title: param.loadingText || '加载中',
  //   mask: true,
  // })
  // param.complete = () => {
  //   wx.hideLoading();
  // }
  wx.request(param);
}

const get = (param) => {
  param.method = 'GET';
  request(param);
}

const getSync = (param) => {
  return new Promise((reslove) => {
    param.method = 'GET';
    param.success = data => {
      reslove(data);
    }
    request(param);
  });
}

const post = (param) => {
  param.method = 'POST';
  request(param);
}

const uploadImage = (param) => {
  let apiUrlPrefix = util.getConfig().apiUrlPrefix;
  let baseParam = {
    url: `${apiUrlPrefix}/uploadImage`,
    filePath: param.filePath,
    name: 'file',
  }
  let authHeader = { "header": auth.getAuthHeader() };
  Object.assign(param, baseParam, authHeader);
  wx.uploadFile(param)
}

const uploadImageSync = (filePath) => {
  return new Promise((reslove) => {
    uploadImage({
      filePath: filePath,
      success: res => {
        console.log('上传图片成功', res);
        const data = JSON.parse(res.data).data;
        reslove(data);
      }
    })
  })
}

const getUserData = (openid, success) => {
  get({
    url: `/getUserByOpenid?openid=${openid}`,
    success: success
  })
}

export default {
  get,
  getSync,
  post,
  uploadImageSync,
  getUserData,
}