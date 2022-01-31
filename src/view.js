/* eslint-disable import/no-cycle */
import onChange from 'on-change';
import { handlerPost } from './handler';

const input = document.getElementById('url-input');
const feedback = document.querySelector('.feedback');
const buttonAdd = document.querySelector('[aria-label="add"]');

const renderModal = (post) => {
  const body = document.querySelector('body');
  body.classList.add('modal-open');
  body.setAttribute('style', 'overflow:hidden;padding-right:17px');

  const modal = document.querySelector('#modal');
  modal.classList.add('show');
  modal.setAttribute('style', 'display:block;');
  modal.removeAttribute('aria-hidden');
  modal.setAttribute('aria-modal', 'true');

  const { titlePost, linkPost, descrPost } = post;
  const title = document.querySelector('.modal-title');
  title.textContent = titlePost;

  const content = document.querySelector('.modal-body');
  content.innerHTML = descrPost;

  const link = document.querySelector('.full-article');
  link.setAttribute('href', linkPost);

  const buttonsClose = document.querySelectorAll('[data-bs-dismiss="modal"]');
  buttonsClose.forEach((button) => {
    button.addEventListener('click', () => {
      body.classList.remove('modal-open');
      body.setAttribute('style', '');

      modal.classList.remove('show');
      modal.setAttribute('style', 'display:none;');
      modal.removeAttribute('aria-modal');
      modal.setAttribute('aria-hidden', 'true');
    });
  });
};

const renderFeed = (state, i18nInstance) => {
  const { feeds } = state;
  if (feeds.length === 0) {
    return;
  }
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.innerHTML = '';

  const div = document.createElement('div');
  div.classList.add('card', 'border-0');
  div.innerHTML = `<div class="card-body"><h2 class="card-title h4">${i18nInstance.t('elements.feeds')}</h2></div>`;
  feedsContainer.append(div);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  div.append(ul);

  feeds.forEach((feed) => {
    const { title, description } = feed;
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.innerHTML = `<h3 class="h6 m-0">${title}</h3><p class="m-0 small text-black-50">${description}</p>`;
    ul.append(li);
  });
};

const renderPost = (state, i18nInstance) => {
  const { posts, viewedPosts } = state;
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
    const { idPost, titlePost, linkPost } = post;
    const isViewed = viewedPosts.includes(idPost);

    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    li.innerHTML = `<a href="${linkPost}" class="${isViewed ? 'fw-normal' : 'fw-bold'}" target="_blank" rel="noopener noreferrer">
      ${titlePost}</a><button type="button" class="btn btn-primary btn-sm">${i18nInstance.t('elements.buttonView')}</button>`;

    const link = li.querySelector('a');
    link.addEventListener('click', () => {
      handlerPost(state, post);
      link.classList.add('fw-normal');
      link.classList.remove('fw-bold');
    });

    const button = li.querySelector('button');
    button.addEventListener('click', () => {
      handlerPost(state, post);
      renderModal(post);
      link.classList.add('fw-normal');
      link.classList.remove('fw-bold');
    });

    ul.append(li);
  });
};

const render = (state, value, i18nInstance) => {
  input.removeAttribute('readonly');
  buttonAdd.removeAttribute('disabled');

  switch (value) {
    case 'sending':
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.remove('text-success');
      feedback.textContent = '';
      input.setAttribute('readonly', 'true');
      buttonAdd.setAttribute('disabled', 'true');
      break;
    case 'failed':
      input.classList.add('is-invalid');
      input.focus();
      feedback.classList.add('text-danger');
      feedback.textContent = i18nInstance.t(state.form.error);
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

const renderLang = (value, i18nInstance, state) => {
  const itemsLang = document.querySelectorAll('[data-language]');
  itemsLang.forEach((item) => {
    if (item.dataset.language === value) {
      item.classList.add('fw-bold');
    } else {
      item.classList.remove('fw-bold');
    }
  });

  const mineTitle = document.querySelector('.main-title');
  mineTitle.textContent = i18nInstance.t('elements.title');

  const lead = document.querySelector('.lead');
  lead.textContent = i18nInstance.t('elements.descr');

  input.setAttribute('placeholder', i18nInstance.t('elements.placeholder'));

  const label = document.querySelector('[for="url-input"]');
  label.textContent = i18nInstance.t('elements.placeholder');

  const example = document.querySelector('#example');
  example.textContent = i18nInstance.t('elements.example');

  buttonAdd.textContent = i18nInstance.t('elements.buttonAdd');

  const buttonRead = document.querySelector('.btn-primary');
  buttonRead.textContent = i18nInstance.t('elements.buttonRead');

  const buttonClose = document.querySelector('.btn-secondary');
  buttonClose.textContent = i18nInstance.t('elements.buttonClose');

  renderFeed(state, i18nInstance);
  renderPost(state, i18nInstance);

  //feedback.textContent = (state.form.error === null && state.form.state !== 'filling') ? i18nInstance.t('success') : i18nInstance.t(state.form.error);
};

export default (state, path, value, i18nInstance) => {
//export default (state, i18nInstance) => {
  //const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.state':
        render(state, value, i18nInstance);
        break;
      case 'lng':
        renderLang(value, i18nInstance, state);
        break;
      default:
        break;
    }
  //});

  //return watchedState;
};
