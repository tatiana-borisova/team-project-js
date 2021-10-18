import refs from './refs';
import teamCardTmpl from '../templates/team-list.hbs';
import movieCardTmpl from '../templates/movie-modal-templ.hbs';
import movieCardTmplRu from '../templates/movieCardTmplRu.hbs';
import teamData from '../json/team-info.json';
import { API_KEY, URL } from './consts';
import { changeLanguage } from './translate';
import { elements } from './elementsObj';
// Этот слушатель на ссылке в футере, сюда добавляйте свои слушатели для открытия
refs.developerLink.addEventListener('click', createTeamModal);
refs.gallery.addEventListener('click', fetchDataByID);

// Эта функция либо закрывает, либо открывает модалку, у нее метод toggle()
function toggleModal() {
  document.body.classList.toggle('modal-open');
  refs.modal.classList.toggle('is-hidden');
}
changeLanguage();
// Эта функция закрывает модалку, очищает HTML и снимает слушатель с крестика
function onClearHtml() {
  toggleModal();
  refs.modalContainer.innerHTML = '';
  refs.closeModalBtn.removeEventListener('click', onClearHtml);
}

// Эта функция открывает модалку по нажатию на ссылку в футере, вешает слушатель на крестик и заодно наполняет ее информацией.
function createTeamModal() {
  // Этот слушатель закрывает модалку по крестику
  refs.closeModalBtn.addEventListener('click', onClearHtml);
  // Информацию переписываем через innerHTML.
  refs.modalContainer.innerHTML = `${teamCardTmpl(teamData)}`;
  toggleModal();
}

// Эта функция открывает модалку по нажатию на логин в хедере, вешает слушатель на крестик и заодно наполняет ее информацией.
function createLoginModal() {
  // Этот слушатель закрывает модалку по крестику
  refs.closeModalBtn.addEventListener('click', onClearHtml);
  // Информацию переписываем через innerHTML.
  toggleModal();
}

// Эта функция открывает модалку по нажатию на карточку фильма, вешает слушатель на крестик и заодно наполняет ее информацией.

// Этот слушатель закрывает модалку по крестику

// Информацию переписываем через innerHTML.
async function fetchDataByID(e) {
  refs.closeModalBtn.addEventListener('click', onClearHtml);
  const movieID = e.target.closest('li').id;
  console.log(movieID);
  try {
    const promise = await fetch(
      `${URL}/3/movie/${movieID}?api_key=${API_KEY}&language=${elements.lang}`,
    );
    if (!promise.ok) throw Error(promise.statusText);
    const data = await promise.json();
    console.log(data);
    console.log(movieCardTmpl(data));
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
