import refs from './refs';
import teamCardTmpl from '../templates/team-list.hbs';
import movieCardTmpl from '../templates/movie-modal-templ.hbs'
import teamData from '../json/team-info.json';
import { API_KEY, URL } from './consts';
import { getFirestore, collection, addDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { ref, set  } from "firebase/database";
import { addToQueue, addToWatched, realTimeDatabase } from './firebase/firebase-auth'




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
  refs.modalContainer.innerHTML = '';
  refs.closeModalBtn.removeEventListener('click', onClearHtml);
}

function createTeamModal() {
  // Этот слушатель закрывает модалку по крестику
  refs.closeModalBtn.addEventListener('click', onClearHtml);
  // Информацию переписываем через innerHTML.
  refs.modalContainer.innerHTML = `${teamCardTmpl(teamData)}`;
  toggleModal();
}

async function fetchDataByID(e) {
  refs.closeModalBtn.addEventListener('click', onClearHtml);
  const movieID = e.target.closest('li').id;
  writeMovieId(realTimeDatabase, movieID)
    try {
      const promise = await fetch(
        `${URL}/3/movie/${movieID}?api_key=${API_KEY}`,
      );
      if (!promise.ok) throw Error(promise.statusText);
      const data = await promise.json();
      insertModalHtml(movieCardTmpl(data));
    } catch (error) {
      console.log('Error:', error);
    }
  toggleModal();
  document.querySelector('.modal-movie__buttons--watched').addEventListener('click', addToWatched)
  document.querySelector('.modal-movie__buttons--queue').addEventListener('click', addToQueue)
}


function insertModalHtml(htmlMarkup) {
  refs.modalContainer.innerHTML = htmlMarkup;
}

function writeMovieId(db, movieId) {
  set(ref(db, 'films/'), {
    movieId: movieId,
  });
}
  
export{toggleModal, insertModalHtml, onClearHtml}