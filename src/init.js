import i18n from 'i18next';
import onChange from 'on-change';
// import handler from './handler.js';
import { handler, handlerChangeLang } from './handler.js';
import resources from './locales/index.js';
import watchedState from './view.js';

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

  // const watched = watchedState(state, i18nInstance);
  console.log(state);
  const watched = onChange(state, (path, value) => (
    watchedState(state, path, value, i18nInstance)));

  console.log(state);
  const form = document.querySelector('#rss-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handler(watched, e, i18nInstance);
  });

  const itemsLang = document.querySelectorAll('[data-language]');
  itemsLang.forEach((item) => {
    item.addEventListener('click', ((e) => {
      handlerChangeLang(watched, e, i18nInstance);
    }));
  });
};
