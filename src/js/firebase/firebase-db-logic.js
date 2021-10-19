import refs from '../refs';
import {firebaseApp, database} from './firebase-app'
import Notiflix from 'notiflix';
import {doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { ref, child, get } from "firebase/database";
import { firebaseConsts } from './firebase-vars';

async function addUserToDatabase(userId, mail) {
  try {
    firebaseConsts.databaseRef = doc(firebaseConsts.fireStoreDatabase, "user", userId)
    await setDoc(firebaseConsts.databaseRef, {
      mail: mail,
      userId: userId,
      watched: [],
      queue: []
    });
  } catch (e) {
    Notiflix.Notify.failure("Error adding to database: ", e);
  } 
}

async function addToWatched() { 
  const movieId = get(child(ref(firebaseConsts.realTimeDatabase), `films/movie`)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();  
    } else {
      Notiflix.Notify.failure("No data available");
    }
  }).catch((error) => {
    Notiflix.Notify.failure(error);
  });
  movieId.then(data => {
    try {
      updateDoc(firebaseConsts.databaseRef, {
        watched: arrayUnion(data)
    });
      Notiflix.Notify.success('The movie successfully added to the queue')
    } catch (error) {
      Notiflix.Notify.failure("Error adding to database: ", error);
      }
  })
  
}

function addToQueue() {
  const movieId = get(child(ref(firebaseConsts.realTimeDatabase), `films/movie`)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val(); 
    } else {
      Notiflix.Notify.failure("No data available");
    }
  }).catch((error) => {
    Notiflix.Notify.failure(error);
  });
  movieId.then(data => {
    try {
      updateDoc(firebaseConsts.databaseRef, {
        queue: arrayUnion(data)
    });
      Notiflix.Notify.success('The movie successfully added to the queue')
    } catch (error) {
      Notiflix.Notify.failure("Error adding to database: ", error);
      }
  })
  
}

export{addToQueue, addToWatched, addUserToDatabase}