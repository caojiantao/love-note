// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'pro-b2c3z',
})

const _ = cloud.database().command;

// 云函数入口函数
exports.main = async (event, context) => {
  let albumId = event.albumId;
  // 获取相册所有关联照片
  let tAlbumImage = cloud.database().collection("t_album_image");
  let albumImageList = await tAlbumImage.where({
    albumId: albumId
  }).get().then(res => res.data);
  if (albumImageList && albumImageList.length > 0) {
    // 删除所有关联的动态
    let albumImageIdList = albumImageList.map(item => item._id);
    let tAction = cloud.database().collection("t_action");
    await tAction.where({
      type: "album_image",
      multi: true,
      refIdList: _.in(albumImageIdList)
    }).remove();
    // 删除相册内所有文件关联关系
    await tAlbumImage.where({
      _id: _.in(albumImageIdList)
    }).remove();
    // 删除关联资源文件
    let fileIdList = albumImageList.map(item => item.fileId);
    await cloud.deleteFile({
      fileList: fileIdList
    });
  }
  // 删除相册
  let tAlbum = cloud.database().collection("t_album");
  let album = await tAlbum.doc(albumId).get().then(res => res.data);
  await tAlbum.doc(albumId).remove();
  // 删除相册封面资源
  await cloud.deleteFile({
    fileList: [album.cover]
  });
}