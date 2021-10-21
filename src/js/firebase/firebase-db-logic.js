import refs from '../refs';
import { firebaseApp, database } from './firebase-app';
import Notiflix from 'notiflix';
import {
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { ref, child, get } from 'firebase/database';
import { firebaseConsts } from './firebase-vars';
import {
  notifyAvailabe,
  notifyMovieQueue,
  notifyErrData,
  notifyMovie,
  notifyDeleteQueue,
  notifyDeleteMovie,
} from '../translate';
import { getWatched, getQueue } from './fetch-from-firebase';

async function addUserToDatabase(userId, mail) {
  try {
    firebaseConsts.databaseRef = doc(
      firebaseConsts.fireStoreDatabase,
      'user',
      userId,
    );
    await setDoc(firebaseConsts.databaseRef, {
      mail: mail,
      userId: userId,
      watched: [],
      queue: [],
    });
  } catch (e) {
    notifyErrData(error);
  }
}

async function addToWatched() {
  const movie = getMovie();
  movie.then(data => {
    const movieId = data.id;
    try {
      setDoc(doc(firebaseConsts.databaseRef, 'watched', `${movieId}`), data);
      updateDoc(firebaseConsts.databaseRef, {
        watched: arrayUnion(data),
      });
      document
        .querySelector('.modal-movie__buttons--watched')
        .classList.add('visually-hidden');
      document
        .querySelector('.modal-movie__buttons--delete-watched')
        .classList.remove('visually-hidden');
      notifyMovie();
    } catch (error) {
      notifyErrData(error.message);
    }
  });
}

async function addToQueue() {
  const movie = getMovie();
  movie.then(data => {
    const movieId = data.id;
    try {
      setDoc(doc(firebaseConsts.databaseRef, 'queue', `${movieId}`), data);
      updateDoc(firebaseConsts.databaseRef, {
        queue: arrayUnion(data),
      });
      document
        .querySelector('.modal-movie__buttons--queue')
        .classList.add('visually-hidden');
      document
        .querySelector('.modal-movie__buttons--delete-queue')
        .classList.remove('visually-hidden');
      notifyMovieQueue();
    } catch (error) {
      notifyErrData(error.message);
    }
  });
}

async function deleteFromWatched() {
  const movie = getMovie();
  movie.then(data => {
    try {
      deleteDoc(doc(firebaseConsts.databaseRef, 'watched', `${data.id}`));
      updateDoc(firebaseConsts.databaseRef, {
        watched: arrayRemove(data),
      });
      document
        .querySelector('.modal-movie__buttons--delete-watched')
        .classList.add('visually-hidden');
      document
        .querySelector('.modal-movie__buttons--watched')
        .classList.remove('visually-hidden');
      notifyDeleteMovie();
      if (refs.libraryLink.classList.contains('header-links__link--current')) {
        getWatched();
      }
    } catch (error) {
      notifyErrData(error);
    }
  });
}

function deleteFromQueue() {
  const movie = getMovie();
  movie.then(data => {
    try {
      deleteDoc(doc(firebaseConsts.databaseRef, 'queue', `${data.id}`));
      updateDoc(firebaseConsts.databaseRef, {
        queue: arrayRemove(data),
      });
      document
        .querySelector('.modal-movie__buttons--delete-queue')
        .classList.add('visually-hidden');
      document
        .querySelector('.modal-movie__buttons--queue')
        .classList.remove('visually-hidden');
      notifyDeleteQueue();
      if (refs.libraryLink.classList.contains('header-links__link--current')) {
        getQueue();
      }
    } catch (error) {
      notifyErrData(error);
    }
  });
}

async function getMovie() {
  const movie = await get(
    child(ref(firebaseConsts.realTimeDatabase), `films/movie`),
  )
    .then(snapshot => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        notifyAvailabe();
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(error);
    });

  return movie;
}

export {
  addToQueue,
  addToWatched,
  addUserToDatabase,
  deleteFromWatched,
  deleteFromQueue,
};
