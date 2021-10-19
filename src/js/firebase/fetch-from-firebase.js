import { getDoc } from "firebase/firestore";
import { firebaseConsts } from './firebase-vars';
import refs from '../refs'
import movieCardTmpl from '../../templates/film-card'

refs.libraryLink.addEventListener('click', getWatched);
refs.watchedBtn.addEventListener('click', getWatched);
refs.queueBtn.addEventListener('click', getQueue);


async function getWatched() {
    refs.watchedBtn.classList.remove('button--white');
    refs.watchedBtn.classList.add('button--orange');
    refs.queueBtn.classList.remove('button--orange');
    refs.queueBtn.classList.add('button--white');
    refs.gallery.innerHTML = '';
    
    const docUser = await getDoc(firebaseConsts.databaseRef);
    if (docUser.exists()) {
        const watchedMovies = docUser.data().watched.map(movie => {
            movie.genres = movie.genres.map(genre => genre.name)
            cropGenresAndDate(movie);
            return movie
        })
        refs.gallery.innerHTML = movieCardTmpl(watchedMovies)

    } else {
        Notiflix.Notify.failure("No movie found");
    }
}

async function getQueue() {
    refs.queueBtn.classList.add('button--orange');
    refs.queueBtn.classList.remove('button--white');
    refs.watchedBtn.classList.add('button--white');
    refs.watchedBtn.classList.remove('button--orange');
    refs.gallery.innerHTML = '';
    const docUser = await getDoc(firebaseConsts.databaseRef);

    if (docUser.exists()) {
        const watchedMovies = docUser.data().queue.map(movie => {
            movie.genres = movie.genres.map(genre => genre.name);
            cropGenresAndDate(movie)
            return movie
        })
        refs.gallery.innerHTML = movieCardTmpl(watchedMovies)

    } else {
        Notiflix.Notify.failure("No movie found");
    }
}

//это же мы делаем в mainmarkup, так что можно ее вынести
function cropGenresAndDate(movie) {
    if (movie.genres.length > 3) {
                movie.genres = movie.genres.splice(0, 2).join(', ') + otherGenresLang();
            } else {
                movie.genres = movie.genres.join(', ');
            }
    if (movie.release_date) movie.release_date = movie.release_date.slice(0, 4);
}

function otherGenresLang() {
  if (fetchApi.lang === 'en') {
    return ', Other';
  } else {
    return ', другие';
  }
}
