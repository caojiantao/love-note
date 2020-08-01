// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'pro-b2c3z',
})

// 云函数入口函数
exports.main = async (event, context) => {
  let albumId = event.albumId,
      coupleId = event.coupleId,
      userId = event.userId,
      fileIdList = event.fileIdList;
  let timestamp = new Date().getTime();
  // 1. 批量插入相册关联图片表
  let tAlbumImage = cloud.database().collection("t_album_image");
  let taskList = [];
  fileIdList.forEach(fileId => {
    let task = tAlbumImage.add({
      data: {
        albumId: albumId,
        coupleId: coupleId,
        userId: userId,
        fileId: fileId,
        timestamp: timestamp
      }
    });
    taskList.push(task);
  });
  let refIdList = [];
  // 2. Promise.all 等待所有插入任务完成
  await Promise.all(taskList).then(resList => {
    console.log(resList)
    refIdList = resList.map(res => res._id);
  });
  // 3. 添加到个人动态
  let tAction = cloud.database().collection("t_action");
  await tAction.add({
    data: {
      type: "album_image",
      coupleId: coupleId,
      userId: userId,
      multi: true,
      refIdList: refIdList,
      timestamp: timestamp
    }
  })
}