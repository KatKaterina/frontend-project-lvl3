import onChange from 'on-change';
// import i18n from 'i18next';
// import state from './state.js';
// import resources from './locales/index.js';

const renderFeed = (state, i18nInstance) => {
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.innerHTML = '';
  const div = document.createElement('div');
  div.classList.add('card', 'border-0');
  div.innerHTML = `<div class="card-body"><h2 class="card-title h4">${i18nInstance.t('elements.feeds')}</h2></div>`;
  feedsContainer.append(div);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  div.append(ul);

  const { feeds } = state;
  feeds.forEach((feed) => {
    const { idFeed, title, description } = feed;
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.innerHTML = `<h3 class="h6 m-0">${title}</h3><p class="m-0 small text-black-50">${description}</p>`;
    ul.append(li);
  });
};

const renderPost = (state, i18nInstance) => {
  const { posts } = state;
  if (posts.length === 0) {
    return;
  }
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = '';
  const div = document.createElement('div');
  div.classList.add('card', 'border-0');
  div.innerHTML = `<div class="card-body"><h2 class="card-title h4">${i18nInstance.t('elements.posts')}</h2></div>`;
  postsContainer.append(div);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  div.append(ul);

  
  posts.forEach((post) => {
    const isViewed = false;
    const { idFeed, idPost, titlePost, linkPost, descrPost, } = post;
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    li.innerHTML = `<a href="${linkPost}" class="${isViewed ? 'font-weight-normal' : 'font-weight-bold'}" target="_blank" rel="noopener noreferrer">
      ${titlePost}</a>
      <button type="button" class="btn btn-primary btn-sm">${i18nInstance.t('elements.buttonView')}</button>`;
    ul.append(li);
  });
};

const render = (state, value, i18nInstance) => {
  const input = document.getElementById('url-input');
  const feedback = document.querySelector('.feedback');

  switch (value) {
    case 'sending':
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.remove('text-success');
      feedback.textContent = '';
      break;
    case 'failed':
      input.classList.add('is-invalid');
      input.focus();
      feedback.classList.add('text-danger');
      feedback.textContent = state.form.error;
      break;
    case 'success':
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18nInstance.t('success');
      input.value = '';
      input.focus();
      renderFeed(state, i18nInstance);
      renderPost(state, i18nInstance);
      break;
    case 'updated':
      renderPost(state, i18nInstance);
      break;
    default:
      break;
  }
};

export default (state, i18nInstance) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.state':
        render(state, value, i18nInstance);
        break;
      default:
        // renderFeed(state, i18nInstance);
        break;
    }
  });

  return watchedState;
};
// export default watchedState;
