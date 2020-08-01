const getParamFromObj = obj => {
  if (!obj) {
    return;
  }
  let arr = [];
  for (let key in obj) {
    let param = `${key}=${obj[key]}`;
    arr.push(param);
  }
  return arr.join("&");
}

module.exports = {
  getParamFromObj: getParamFromObj
}
