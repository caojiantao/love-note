// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'pro-b2c3z',
})

const _ = cloud.database().command;

// 云函数入口函数
exports.main = async (event, context) => {
  let albumImageId = event.albumImageId;
  let tAlbumImage = cloud.database().collection("t_album_image");
  let albumImage = await tAlbumImage.doc(albumImageId).get().then(res => res.data);
  // 删除相册关联关系
  await tAlbumImage.doc(albumImageId).remove();
  // 删除关联动态
  let tAction = cloud.database().collection("t_action");
  let actionList = await tAction.where({
    refIdList: albumImageId
  }).get().then(res => res.data);
  if (actionList && actionList.length > 0) {
    for (let action of actionList) {
      let refIdList = action.refIdList;
      let index = refIdList.indexOf(albumImageId);
      refIdList.splice(index, 1);
      if (action.refIdList.length == 0) {
        // 关联图片为空，删除该动态
        await tAction.doc(action._id).remove();
      } else {
        // 仅删除关联的图片主键
        await tAction.doc(action._id).update({
          data: {refIdList: refIdList}
        });
      }
    }
  }
  // 删除关联资源文件
  await cloud.deleteFile({
    fileList: [albumImage.fileId]
  });
}