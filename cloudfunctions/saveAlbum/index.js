// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let album = event.album;
  let albumId;
  album.timestamp = new Date().getTime();
  let tAlbum = cloud.database().collection("t_album");
  if (album._id) {
    // 更新
    await tAlbum.doc(album._id).update({data:album});
  } else {
    // 插入
    await tAlbum.add({data: album}).then(res => {album._id = res._id});
    // 添加动态
    await addAlbumAction(album);
  }
  return album;
}

async function addAlbumAction (album) {
  let tAction = cloud.database().collection('t_action');
  await tAction.add({
    data: {
      type: "album",
      userId: album.userId,
      coupleId: album.coupleId,
      relId: album._id,
      timestamp: new Date().getTime()
    }
  });
}
