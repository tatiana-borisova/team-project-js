import refs from '../refs';
import { firebaseApp, database } from './firebase-app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import Notiflix from 'notiflix';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, child, get } from 'firebase/database';
import { toggleModal, createLoginModal } from '../modal';
import { firebaseConsts } from './firebase-vars';
import {
  notifyLoginRu,
  notifyAccept,
  notifyLoggedIn,
  notifyLoggedOut,
  notifyAvailabe,
  notifyMovieQueue,
  notifyErrData,
} from '../translate';
import { fetchApi } from '../fetch-api';
refs.loginLink.addEventListener('click', createLoginModal);
refs.logoutLink.addEventListener('click', signOut);

onAuthStateChanged(firebaseConsts.auth, user => {
  if (user) {
    toggleLogLinks();
    refs.libraryLink.classList.remove('visually-hidden');
    firebaseConsts.userID = user.uid;
    firebaseConsts.databaseRef = doc(
      firebaseConsts.fireStoreDatabase,
      'user',
      firebaseConsts.userID,
    );
    notifyHello();
  } /* else {
    Notiflix.Notify.warning('You are not logged in');
  } */
});
let email;
let password;
function notifyHello() {
  if (fetchApi.lang === 'en') {
    Notiflix.Notify.success(`Hello, ${firebaseConsts.userID}`);
  } else {
    Notiflix.Notify.success(`Привет, ${firebaseConsts.userID}`);
  }
}
function signUp() {
  email = document.getElementById('email').value;
  password = document.getElementById('password').value;
  createUserWithEmailAndPassword(firebaseConsts.auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;

      console.log(userCredential);
      addUserToDatabase(user.uid, user.email);
      toggleLogLinks();
      toggleModal();
      refs.libraryLink.classList.remove('visually-hidden');
      notifyAccept();
    })
    .catch(error => {
      Notiflix.Notify.failure(error.message);
    });
}

function signIn() {
  email = document.getElementById('email').value;
  password = document.getElementById('password').value;
  signInWithEmailAndPassword(firebaseConsts.auth, email, password)
    .then(userCredential => {
      console.log(password);
      const user = userCredential.user;
      refs.libraryLink.classList.remove('visually-hidden');
      notifyLoggedIn();
    })
    .catch(error => {
      Notiflix.Notify.failure(error.message);
    });
}

function signOut() {
  firebaseConsts.auth.signOut();
  toggleLogLinks();
  refs.libraryLink.classList.add('visually-hidden');
  notifyLoggedOut();
}

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
  } catch (error) {
    notifyErrData(error);
  }
}

function addListeners() {
  const loginForm = document.getElementById('login-form');
  const signUpBtn = document.querySelector('.sign-up');
  const signInBtn = document.querySelector('.sign-in');

  loginForm.addEventListener('submit', event => {
    event.preventDefault();
  });
  signUpBtn.addEventListener('click', signUp);
  signInBtn.addEventListener('click', signIn);
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

function toggleLogLinks() {
  refs.loginLink.classList.toggle('visually-hidden');
  refs.logoutLink.classList.toggle('visually-hidden');
}

export { addToQueue, addToWatched, addListeners };
