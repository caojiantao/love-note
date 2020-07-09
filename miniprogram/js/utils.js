const getParamFromObj = obj => {
  let arr = [];
  for (let key in options) {
    let param = `${key}=${options[key]}`;
    arr.push(param);
  }
  return arr.join("&");
}

module.exports = {
  getParamFromObj: getParamFromObj
}
