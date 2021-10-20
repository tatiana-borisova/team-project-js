import refs from '../refs';
import { firebaseApp, database } from './firebase-app';
import Notiflix from 'notiflix';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, child, get } from 'firebase/database';
import { firebaseConsts } from './firebase-vars';
import { notifyAvailabe, notifyMovieQueue, notifyErrData } from '../translate';
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
  const movieId = get(
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
  movieId.then(data => {
    try {
      updateDoc(firebaseConsts.databaseRef, {
        watched: arrayUnion(data),
      });
      document.querySelector('.modal-movie__buttons--close-watched').classList.remove('visually-hidden')
      document.querySelector('.modal-movie__buttons--watched').classList.add('visually-hidden')
      notifyMovieQueue();
    } catch (error) {
      notifyErrData(error);
    }
  });
}

function addToQueue() {
  const movieId = get(
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
  movieId.then(data => {
    try {
      updateDoc(firebaseConsts.databaseRef, {
        queue: arrayUnion(data),
      });
      notifyMovieQueue();
      document.querySelector('.modal-movie__buttons--queue').classList.add('visually-hidden')
      document.querySelector('.modal-movie__buttons--close-queue').classList.remove('visually-hidden')
    } catch (error) {
      notifyErrData(error);
    }
  });
}

function deleteFromWatched() {
  
}

function deleteFromQueue() {
  
}

export { addToQueue, addToWatched, addUserToDatabase, deleteFromWatched, deleteFromQueue };
