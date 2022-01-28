import i18n from 'i18next';
import handler from './handler.js';
import resources from './locales/index.js';

export default () => {
  const state = {
    lng: 'ru',
    form: {
      state: 'filling',
      error: null,
    },
    feeds: [],
    posts: [],
    viewedPosts: [],
    validUrls: [],
    updateProcess: null,
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    resources,
  });

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handler(state, e, i18nInstance);
  });
};
