import validate from './validate.js';
import watchedState from './view.js';
import uploadRSS from './uploadRSS';
import parse from './parse.js';

const uploadChannel = (url, i18nInstance) => {
  // result = { errorUpload, formState, feed, posts}
  let result = {};
  return uploadRSS(url)
    .then((response) => {
      const resultParse = parse(response.data.contents);
      if (resultParse === null) {
        // watched.form.error = i18nInstance.t('errors.parseError');
        // watched.form.state = 'failed';
        return { errorUpload: i18nInstance.t('errors.parseError'), formState: 'failed', feed: {}, posts: [] };
      }
      const { feed, posts } = resultParse;
      // console.log(feed);
      // console.log(posts);
      // state.feeds.unshift(feed);
      // state.posts = [...posts, ...state.posts];
      // watched.form.state = 'success';
      // console.log(state.posts);
      // watched.validUrls.unshift(url);
      return { errorUpload: null, formState: 'success', feed, posts };
    })
    .catch((error) => {
      // console.log(error);
      // watched.form.state = 'failed';
      if (error.isAxiosError) {
        // watched.form.error = i18nInstance.t('errors.networkError');
        return { errorUpload: i18nInstance.t('errors.networkError'), formState: 'failed', feed: {}, posts:[] };
      }
      // watched.form.error = i18nInstance.t('errors.invalid');
      return { errorUpload: i18nInstance.t('errors.invalid'), formState: 'failed', feed: {}, posts:[] };
    });
};

const updateRSS = (state, i18nInstance, watched) => {
  const interval = 5000;
  //state.feeds = [];
  //state.posts = [];

  const updatePosts = () => {
    watched.form.state = 'updating';
    const promises = state.validUrls.map((url) => uploadChannel(url, i18nInstance));
    console.log(promises);
    Promise.all(promises)
      .then((result) => {
        state.updateProcess = 'running';
        console.log(result);
        const { errorUpload, formState, feed, posts } = result;
        if (errorUpload === null) {
          //state.feeds.unshift(feed);
          state.posts = [...posts, ...state.posts];
        }
        watched.form.error = errorUpload;
        // watched.form.state = formState;
        watched.form.state = 'updated';
        setTimeout(updatePosts, interval);
      })
      .catch(() => updatePosts());
  };

  if (state.updateProcess === null) {
    //state.updateProcess = 'running';
    setTimeout(updatePosts
    /* {
       const promises = state.validUrls.map((url) => uploadChannel(url, i18nInstance));
      console.log(promises);
      Promise.all(promises)
        .then((result) => {
          console.log(result);
          const { errorUpload, formState, feed, posts } = result;
          if (errorUpload === null) {
            //state.feeds.unshift(feed);
            state.posts = [...posts, ...state.posts];
          }
          watched.form.error = errorUpload;
          watched.form.state = formState;
          updateRSS(state, i18nInstance, watched);
        }) 
        .catch(() => updateRSS(state, i18nInstance, watched));*/
    , interval);
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

        /* const { errorUpload, formState, feed, posts } = uploadChannel(currentUrl);
        if (errorUpload === null) {
          state.feeds.unshift(feed);
          state.posts = [...posts, ...state.posts];
          state.validUrls.unshift(currentUrl);
        }
        watched.form.error = errorUpload;
        watched.form.state = formState;*/
        uploadChannel(currentUrl, i18nInstance)
          .then((result) => {
            const { errorUpload, formState, feed, posts } = result;
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
  // .catch((e) => watchedState.errors.push(e));
};

export default handler;
