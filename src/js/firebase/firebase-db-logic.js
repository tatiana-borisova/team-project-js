import refs from '../refs';
import { firebaseApp, database } from './firebase-app';
import Notiflix from 'notiflix';
import { doc, setDoc, deleteDoc, updateDoc, arrayUnion} from 'firebase/firestore';
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
  const movie = get(
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
  movie.then(data => {
    const movieId = data.id;
    try {
      setDoc(doc(firebaseConsts.databaseRef, "watched", `${movieId}`), data);
      updateDoc(firebaseConsts.databaseRef, {
        watched: arrayUnion(data),
      });
      document.querySelector('.modal-movie__buttons--watched').classList.add('visually-hidden')
      document.querySelector('.modal-movie__buttons--delete-watched').classList.remove('visually-hidden')
      notifyMovieQueue();
    } catch (error) {
      notifyErrData(error.message);
    }
    
  });
}

async function addToQueue() {
  const movie = get(
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
  movie.then(data => {
    const movieId = data.id;
    try {
      setDoc(doc(firebaseConsts.databaseRef, "queue", `${movieId}`), data);
      document.querySelector('.modal-movie__buttons--queue').classList.add('visually-hidden')
      document.querySelector('.modal-movie__buttons--delete-queue').classList.remove('visually-hidden')
      notifyMovieQueue();
    } catch (error) {
      notifyErrData(error.message);
    }
  });
}

async function deleteFromWatched() {
  const movieId = getMovieId();
  movieId.then(id => {
    try {
      deleteDoc(doc(firebaseConsts.databaseRef, "watched", `${id}`));
      document.querySelector('.modal-movie__buttons--delete-watched').classList.add('visually-hidden')
      document.querySelector('.modal-movie__buttons--watched').classList.remove('visually-hidden')
      Notiflix.Notify.success("The movie was deleted from watched")
    } catch (error) {
      notifyErrData(error);
    }
  });  
}

function deleteFromQueue() {
  const movieId = getMovieId();
  movieId.then(id => {
    try {
      deleteDoc(doc(firebaseConsts.databaseRef, "queue", `${id}`));
      document.querySelector('.modal-movie__buttons--delete-queue').classList.add('visually-hidden')
      document.querySelector('.modal-movie__buttons--queue').classList.remove('visually-hidden')
      Notiflix.Notify.success("The movie was deleted from queue")
    } catch (error) {
      notifyErrData(error);
    }
  }); 
}

async function getMovieId() {
  return await get(child(ref(firebaseConsts.realTimeDatabase), `films/movieId`),)
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
}

export { addToQueue, addToWatched, addUserToDatabase, deleteFromWatched, deleteFromQueue };
