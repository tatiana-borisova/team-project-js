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
    } catch (error) {
      notifyErrData(error);
    }
  });
}

export { addToQueue, addToWatched, addUserToDatabase };
