const timeFmt = (timestamp) => {
  if (!timestamp) {
    return null;
  }
  let diff = (new Date().getTime() - timestamp) / 1000;
  let step = [60, 60, 24];
  let unit = ["秒", "分钟", "小时", "天"];
  let i = 0;
  while (i < step.length) {
    if (diff < step[i]) {
      break;
    }
    diff /= step[i++];
  }
  return Math.round(diff) + unit[i] + "前";
}

module.exports = {
  timeFmt: timeFmt
}
