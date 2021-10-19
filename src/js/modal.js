import refs from './refs';
import teamCardTmpl from '../templates/team-list.hbs';
import teamCardTmplRu from '../templates/team-listRu.hbs';
import loginHtml from '../html-partials/authentication.html';
import movieCardTmpl from '../templates/movie-modal-templ.hbs';
import movieCardTmplRu from '../templates/movie-modal-templRu.hbs';
import teamDataRu from '../json/team-infoRu.json';
import teamData from '../json/team-info.json';
import { API_KEY, URL } from './consts';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { ref, set } from 'firebase/database';
import {
  addToQueue,
  addToWatched,
  addListeners,
} from './firebase/firebase-auth';
import { firebaseConsts } from './firebase/firebase-vars';
import { fetchDataByID, fetchApi } from './fetch-api.js';
import { changeLanguage } from './translate';

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
  if (fetchApi.lang === 'en') {
    insertModalHtml(teamCardTmpl(teamData));
  } else {
    insertModalHtml(teamCardTmpl(teamDataRu));
  }
  toggleModal();
}

// Эта функция открывает модалку по нажатию на логин в хедере.
function createLoginModal() {
  onClearHtml();
  addClosingListeners();
  insertModalHtml(loginHtml);
  toggleModal();
  addListeners();
  changeLanguage();
}
changeLanguage();
// Эта функция открывает модалку по нажатию на карточку фильма.

async function createMovieModal(e) {
  onClearHtml();
  addClosingListeners();
  if (!e.target.closest('li')) {
    return;
  }
  fetchApi.movieID = e.target.closest('li').id;
  const data = await fetchDataByID();
  if (fetchApi.lang === 'en') {
    insertModalHtml(movieCardTmpl(data));
  } else {
    insertModalHtml(movieCardTmplRu(data));
  }
  writeMovieId(firebaseConsts.realTimeDatabase, data);
  toggleModal();

  document
    .querySelector('.modal-movie__buttons--watched')
    .addEventListener('click', addToWatched);
  document
    .querySelector('.modal-movie__buttons--queue')
    .addEventListener('click', addToQueue);
}

function insertModalHtml(htmlMarkup) {
  refs.modalContainer.innerHTML = htmlMarkup;
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

function writeMovieId(db, movieJson) {
  set(ref(db, 'films/'), {
    movie: movieJson,
  });
}

export { toggleModal, createLoginModal };
