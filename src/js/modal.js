import refs from './refs';
import teamCardTmpl from '../templates/team-list.hbs';
import movieCardTmpl from '../templates/movie-modal-templ.hbs';
import teamData from '../json/team-info.json';
import { fetchDataByID, fetchApi } from './fetch-api.js';

// Сюда добавляйте свои слушатели для открытия
refs.developerLink.addEventListener('click', createTeamModal);
refs.gallery.addEventListener('click', createMovieModal);

// Эта функция либо закрывает, либо открывает модалку, у нее метод toggle()
function toggleModal() {
  document.body.classList.toggle('modal-open');
  refs.modal.classList.toggle('is-hidden');
}

// Эта функция закрывает модалку и снимает слушателей.
function onCloseHtml() {
  toggleModal();
  removeClosingListeners();
}

// Эта функция открывает модалку по нажатию на ссылку в футере.
function createTeamModal(e) {
  e.preventDefault();
  onClearHtml();
  addClosingListeners();
  refs.modalContainer.innerHTML = `${teamCardTmpl(teamData)}`;
  toggleModal();
}

// Эта функция открывает модалку по нажатию на логин в хедере.
function createLoginModal() {
  onClearHtml();
  addClosingListeners();
  toggleModal();
}

// Эта функция открывает модалку по нажатию на карточку фильма.

async function createMovieModal(e) {
  onClearHtml();
  addClosingListeners();
  if (!e.target.closest('li')) {
    return;
  }
  fetchApi.movieID = e.target.closest('li').id;
  const data = await fetchDataByID();
  refs.modalContainer.innerHTML = movieCardTmpl(data);
  toggleModal();
}

function onKeyDown(e) {
  if (e.code === 'Escape') {
    onCloseHtml();
  }
}

function onBackdropClick(e) {
  if (!e.target.classList.contains('backdrop')) {
    return;
  }
  onCloseHtml();
}

function addClosingListeners() {
  refs.closeModalBtn.addEventListener('click', onCloseHtml);
  refs.backdrop.addEventListener('click', onBackdropClick);
  window.addEventListener('keydown', onKeyDown);
}

function removeClosingListeners() {
  refs.closeModalBtn.removeEventListener('click', onCloseHtml);
  refs.backdrop.removeEventListener('click', onBackdropClick);
  window.removeEventListener('keydown', onKeyDown);
}

function onClearHtml() {
  refs.modalContainer.innerHTML = '';
}
