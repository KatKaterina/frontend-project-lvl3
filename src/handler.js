/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import _ from 'lodash';
import validate from './validate.js';
import watchedState from './view.js';
import uploadRSS from './uploadRSS';
import parse from './parse.js';

const uploadChannel = (url, i18nInstance) => uploadRSS(url)
  .then((response) => {
    const resultParse = parse(response.data.contents);
    if (resultParse === null) {
      return {
        errorUpload: i18nInstance.t('errors.parseError'),
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
        errorUpload: i18nInstance.t('errors.networkError'),
        formState: 'failed',
        feed: {},
        posts: [],
      };
    }
    return {
      errorUpload: i18nInstance.t('errors.invalid'),
      formState: 'failed',
      feed: {},
      posts: [],
    };
  });

const updateRSS = (state, i18nInstance, watched) => {
  const interval = 5000;

  const updatePosts = () => {
    watched.form.state = 'updating';
    const promises = state.validUrls.map((url) => uploadChannel(url, i18nInstance));
    Promise.all(promises)
      .then((results) => {
        state.updateProcess = 'running';
        results.forEach((result) => {
          const { errorUpload, posts } = result;
          if (errorUpload === null) {
            const unionPosts = _.unionBy(state.posts, posts, 'linkPost');
            const newPosts = _.differenceBy(unionPosts, state.posts, 'linkPost');
            state.posts = [...newPosts, ...state.posts];
          }
          watched.form.error = errorUpload;
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

const handler = (state, el, i18nInstance) => {
  const formData = new FormData(el.target);
  const currentUrl = formData.get('url').trim();
  const watched = watchedState(state, i18nInstance);

  watched.form.state = 'sending';

  const urls = state.validUrls;
  validate({ url: currentUrl }, urls, i18nInstance)
    .then((errors) => {
      if (errors) {
        watched.form.error = errors.message;
        watched.form.state = 'failed';
      } else {
        uploadChannel(currentUrl, i18nInstance)
          .then((result) => {
            const {
              errorUpload,
              formState,
              feed,
              posts,
            } = result;

            if (errorUpload === null) {
              state.feeds.unshift(feed);
              state.posts = [...posts, ...state.posts];
              state.validUrls.unshift(currentUrl);
            }
            watched.form.error = errorUpload;
            watched.form.state = formState;
          });
      }
    })
    .then(() => {
      updateRSS(state, i18nInstance, watched);
    });
};

export const handlerPost = (state, post) => {
  const { idPost } = post;
  if (!state.viewedPosts.includes(idPost)) {
    state.viewedPosts.push(idPost);
  }
};

export default handler;
