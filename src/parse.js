import _ from 'lodash';

export default (data) => {
  const parser = new DOMParser();

  const rss = parser.parseFromString(data, 'application/xml');
  const errorNode = rss.querySelector('parsererror');
  if (errorNode) {
    return null;
  }

  const idFeed = _.uniqueId();
  const title = rss.querySelector('title').textContent;
  const description = rss.querySelector('description').textContent;
  const feed = { idFeed, title, description };

  const posts = [];
  const items = rss.querySelectorAll('item');
  items.forEach((item) => {
    const titlePost = item.querySelector('title').textContent;
    const linkPost = item.querySelector('link').textContent;
    const descrPost = item.querySelector('description').textContent;
    const idPost = _.uniqueId();

    const post = {
      idFeed, idPost, titlePost, linkPost, descrPost,
    };
    posts.push(post);
  });
  return { feed, posts };
};
