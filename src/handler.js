/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import _ from 'lodash';
import validate from './validate.js';
// import watchedState from './view.js';
import uploadRSS from './uploadRSS';
import parse from './parse.js';

const uploadChannel = (url) => uploadRSS(url)
  .then((response) => {
    const resultParse = parse(response.data.contents);
    if (resultParse === null) {
      return {
        errorUpload: 'errors.parseError',
        formState: 'failed',
        feed: {},
        posts: [],
      };
    }
    const { feed, posts } = resultParse;
    return {
      errorUpload: null,
      formState: 'success',
      feed,
      posts,
    };
  })
  .catch((error) => {
    if (error.isAxiosError) {
      return {
        errorUpload: 'errors.networkError',
        formState: 'failed',
        feed: {},
        posts: [],
      };
    }
    return {
      errorUpload: 'errors.invalid',
      formState: 'failed',
      feed: {},
      posts: [],
    };
  });

const updateRSS = (state, watched) => {
  const interval = 5000;

  const updatePosts = () => {
    watched.form.state = 'updating';
    const promises = state.validUrls.map((url) => uploadChannel(url));
    Promise.all(promises)
      .then((results) => {
        state.updateProcess = 'running';
        results.forEach((result) => {
          const { errorUpload, posts } = result;
          if (errorUpload === null) {
            const unionPosts = _.unionBy(state.posts, posts, 'linkPost');
            const newPosts = _.differenceBy(unionPosts, state.posts, 'linkPost');
            state.posts = [...newPosts, ...state.posts];
          } else {
            watched.form.error = errorUpload;
          }
        });
        watched.form.state = 'updated';
        setTimeout(updatePosts, interval);
      })
      .catch(() => updatePosts());
  };

  if (state.updateProcess === null) {
    setTimeout(updatePosts, interval);
  }
};

export const handler = (watched, el) => {
  const formData = new FormData(el.target);
  const currentUrl = formData.get('url').trim();
  // const watched = watchedState(state, i18nInstance);

  watched.form.state = 'sending';

  const urls = watched.validUrls;
  validate({ url: currentUrl }, urls)
    .then((errors) => {
      if (errors) {
        watched.form.error = errors.message;
        watched.form.state = 'failed';
      } else {
        uploadChannel(currentUrl)
          .then((result) => {
            const {
              errorUpload,
              formState,
              feed,
              posts,
            } = result;

            if (errorUpload === null) {
              watched.feeds.unshift(feed);
              watched.posts = [...posts, ...watched.posts];
              watched.validUrls.unshift(currentUrl);
            }
            watched.form.error = errorUpload;
            watched.form.state = formState;
          });
      }
    })
    .then(() => {
      updateRSS(watched, watched);
    });
};

export const handlerPost = (watched, post) => {
  const { idPost } = post;
  if (!watched.viewedPosts.includes(idPost)) {
    watched.viewedPosts.push(idPost);
  }
};

export const handlerChangeLang = (watched, el, i18nInstance) => {
  i18nInstance.changeLanguage(el.target.dataset.language);
  watched.lng = el.target.dataset.language;
};

// export default handler;
