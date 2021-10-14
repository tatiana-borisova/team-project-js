import refs from './refs';
import teamCardTmpl from '../templates/team-list.hbs';
import teamData from '../json/team-info.json';

// Этот слушатель на ссылке в футере
refs.developerLink.addEventListener('click', createTeamModal);
// Этот слушатель закрывает модалку по крестику
refs.closeModalBtn.addEventListener('click', toggleModal);

// Эта функция либо закрывает, либо открывает модалку, у нее метод toggle()
function toggleModal() {
  document.body.classList.toggle('modal-open');
  refs.modal.classList.toggle('is-hidden');
}

// Эта функция открывает модалку по нажатию на ссылку в футере и заодно наполняет ее информацией.
function createTeamModal() {
  // Информацию переписываем только через innerHTML, т.к. модалка одна.
  refs.modalContainer.innerHTML = `${teamCardTmpl(teamData)}`;
  toggleModal();
}

// Эта функция открывает модалку по нажатию на логин в хедере и заодно наполняет ее информацией.
function createLoginModal() {
  toggleModal();
  // Информацию переписываем только через innerHTML, т.к. модалка одна.
}

// Эта функция открывает модалку по нажатию на карточку фильма и заодно наполняет ее информацией.
function createMovieModal() {
  toggleModal();
  // Информацию переписываем только через innerHTML, т.к. модалка одна.
}
