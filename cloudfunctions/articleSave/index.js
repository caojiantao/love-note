// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    let article = event.article;
    let tArticle = cloud.database().collection('t_article');
    if (article._id) {
      // 更新
      await tArticle.doc(article._id).update({
        data: article
      }).then(() => {});
      return null;
    } else {
      // 新增
      let articleId;
      await tArticle.add({
        data: article
      }).then(res => {
        articleId = res._id
      });
      article._id = articleId;
      // 添加动态
      await addArticleAction(article);
      return null;
    }
}

async function addArticleAction (article) {
  let tAction = cloud.database().collection('t_action');
  await tAction.add({
    data: {
      type: "article",
      userId: article.userId,
      coupleId: article.coupleId,
      relId: article._id,
      timestamp: new Date().getTime()
    }
  }).then(() => {});
}