import refs from './refs';
import teamCardTmpl from '../templates/team-list.hbs';
import loginHtml from '../html-partials/authentication.html'
import teamData from '../json/team-info.json';

// Этот слушатель на ссылке в футере, сюда добавляйте свои слушатели для открытия
refs.developerLink.addEventListener('click', createTeamModal);
refs.loginLink.addEventListener('click', createLoginModal);

// Эта функция либо закрывает, либо открывает модалку, у нее метод toggle()
function toggleModal() {
  document.body.classList.toggle('modal-open');
  refs.modal.classList.toggle('is-hidden');
}

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
  //refs.modalContainer.insertAdjacentHTML('beforeend', loginHtml )
  refs.modalContainer.innerHTML = `${loginHtml}`
  toggleModal();
  refs.loginForm.addEventListener("submit",(event)=>{
    event.preventDefault()
  })
  refs.signUpBtn.addEventListener('click', signUp);
  refs.signInBtn.addEventListener('click', signIn);
  refs.signOutBtn.addEventListener('click', signOut);
}

// Эта функция открывает модалку по нажатию на карточку фильма, вешает слушатель на крестик и заодно наполняет ее информацией.
function createMovieModal() {
  // Этот слушатель закрывает модалку по крестику
  refs.closeModalBtn.addEventListener('click', onClearHtml);
  // Информацию переписываем через innerHTML.
  toggleModal();
}

export{toggleModal, createLoginModal}