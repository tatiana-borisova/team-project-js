import refs from './refs';
import teamCardTmpl from '../templates/team-list.hbs';
import movieCardTmpl from '../templates/movie-modal-templ.hbs';
import teamData from '../json/team-info.json';
import { API_KEY, URL } from './consts';

// Этот слушатель на ссылке в футере, сюда добавляйте свои слушатели для открытия
refs.developerLink.addEventListener('click', createTeamModal);
refs.gallery.addEventListener('click', fetchDataByID);

// Эта функция либо закрывает, либо открывает модалку, у нее метод toggle()
function toggleModal() {
  document.body.classList.toggle('modal-open');
  refs.modal.classList.toggle('is-hidden');
}

// Эта функция закрывает модалку, очищает HTML и снимает слушатель с крестика
function onClearHtml() {
  toggleModal();
  refs.closeModalBtn.removeEventListener('click', onClearHtml);
}

// Эта функция открывает модалку по нажатию на ссылку в футере, вешает слушатель на крестик и заодно наполняет ее информацией.
function createTeamModal(e) {
  e.preventDefault();
  refs.modalContainer.innerHTML = '';
  // Этот слушатель закрывает модалку по крестику
  refs.closeModalBtn.addEventListener('click', onClearHtml);
  refs.backdrop.addEventListener('click', () => console.log('Hallo'));
  // Информацию переписываем через innerHTML.
  refs.modalContainer.innerHTML = `${teamCardTmpl(teamData)}`;
  toggleModal();
}

// Эта функция открывает модалку по нажатию на логин в хедере, вешает слушатель на крестик и заодно наполняет ее информацией.
function createLoginModal() {
  refs.modalContainer.innerHTML = '';
  // Этот слушатель закрывает модалку по крестику
  refs.closeModalBtn.addEventListener('click', onClearHtml);
  // Информацию переписываем через innerHTML.
  toggleModal();
}

// Эта функция открывает модалку по нажатию на карточку фильма, вешает слушатель на крестик и заодно наполняет ее информацией.

async function fetchDataByID(e) {
  refs.modalContainer.innerHTML = '';
  refs.closeModalBtn.addEventListener('click', onClearHtml);
  if (!e.target.closest('li')) {
    return;
  }
  const movieID = e.target.closest('li').id;
  try {
    const promise = await fetch(`${URL}/3/movie/${movieID}?api_key=${API_KEY}`);
    if (!promise.ok) throw Error(promise.statusText);
    const data = await promise.json();
    // console.log(data);
    // console.log(movieCardTmpl(data));
    refs.modalContainer.innerHTML = movieCardTmpl(data);
  } catch (error) {
    console.log('Error:', error);
  }
  toggleModal();
}
