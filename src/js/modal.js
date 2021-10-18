import refs from './refs';
import teamCardTmpl from '../templates/team-list.hbs';
import teamCardTmplRu from '../templates/team-listRu.hbs';
import movieCardTmpl from '../templates/movie-modal-templ.hbs';
import movieCardTmplRu from '../templates/movieCardTmplRu.hbs';
import teamDataRu from '../json/team-infoRu.json';
import teamData from '../json/team-info.json';
import { API_KEY, URL } from './consts';
import { changeLanguage } from './translate';
import { elements } from './elementsObj';

// Сюда добавляйте свои слушатели для открытия
refs.developerLink.addEventListener('click', createTeamModal);
refs.gallery.addEventListener('click', fetchDataByID);

// Эта функция либо закрывает, либо открывает модалку, у нее метод toggle()
function toggleModal() {
  document.body.classList.toggle('modal-open');
  refs.modal.classList.toggle('is-hidden');
}

// Эта функция закрывает модалку, очищает HTML и снимает слушатель с крестика

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
  if (elements.lang === 'en') {
    refs.modalContainer.innerHTML = `${teamCardTmpl(teamData)}`;
  } else {
    refs.modalContainer.innerHTML = `${teamCardTmplRu(teamDataRu)}`;
  }
  toggleModal();
}

// Эта функция открывает модалку по нажатию на логин в хедере.
function createLoginModal() {
  onClearHtml();
  addClosingListeners();
  toggleModal();
}
changeLanguage();
// Эта функция открывает модалку по нажатию на карточку фильма.

async function fetchDataByID(e) {
  onClearHtml();
  addClosingListeners();
  if (!e.target.closest('li')) {
    return;
  }
  const movieID = e.target.closest('li').id;
  try {
    const promise = await fetch(
      `${URL}/3/movie/${movieID}?api_key=${API_KEY}&language=${elements.lang}`,
    );
    if (!promise.ok) throw Error(promise.statusText);
    const data = await promise.json();
    if (elements.lang === 'en') {
      refs.modalContainer.innerHTML = movieCardTmpl(data);
    } else {
      refs.modalContainer.innerHTML = movieCardTmplRu(data);
    }
  } catch (error) {
    console.log('Error:', error);
  }
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
