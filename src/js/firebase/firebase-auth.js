import refs from '../refs';
import { firebaseApp, database } from './firebase-app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import Notiflix from 'notiflix';
import { doc} from 'firebase/firestore';
import { toggleModal, createLoginModal } from '../modal';
import { firebaseConsts } from './firebase-vars';
import { notifyAccept, notifyLoggedIn, notifyLoggedOut } from '../translate';
import { fetchApi } from '../fetch-api';
import { addUserToDatabase } from './firebase-db-logic';

refs.loginLink.addEventListener('click', createLoginModal);
refs.logoutLink.addEventListener('click', signOut);
onAuthStateChanged(firebaseConsts.auth, user => {
  if (user) {
    toggleLogLinks();
    refs.libraryLink.classList.remove('visually-hidden');
    firebaseConsts.userID = user.uid;
    firebaseConsts.email = user.email;
    firebaseConsts.databaseRef = doc(
      firebaseConsts.fireStoreDatabase,
      'user',
      firebaseConsts.userID,
    );
    notifyHello();
  }
});
function notifyHello() {
  if (fetchApi.lang === 'en') {
    Notiflix.Notify.success(`Hello, ${firebaseConsts.email}`);
  } else {
    Notiflix.Notify.success(`Привет, ${firebaseConsts.email}`);
  }
}
async function signUp() {
  firebaseConsts.email = document.getElementById('email').value;
  firebaseConsts.password = document.getElementById('password').value;
  await createUserWithEmailAndPassword(
    firebaseConsts.auth,
    firebaseConsts.email,
    firebaseConsts.password,
  )
    .then(userCredential => {
      const user = userCredential.user;
      addUserToDatabase(user.uid, user.email);
      refs.libraryLink.classList.remove('visually-hidden');
      toggleModal();
      removeListeners();
      notifyAccept();
    })
    .catch(error => {
      Notiflix.Notify.failure(error.message);
    });
}

async function signIn() {
  firebaseConsts.email = document.getElementById('email').value;
  firebaseConsts.password = document.getElementById('password').value;
  await signInWithEmailAndPassword(
    firebaseConsts.auth,
    firebaseConsts.email,
    firebaseConsts.password,
  )
    .then(userCredential => {
      toggleModal();
      removeListeners();
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

function removeListeners() {
  const signUpBtn = document.querySelector('.sign-up');
  const signInBtn = document.querySelector('.sign-in');

  signUpBtn.removeEventListener('click', signUp);
  signInBtn.removeEventListener('click', signIn);
}

function toggleLogLinks() {
  refs.loginLink.classList.toggle('visually-hidden');
  refs.logoutLink.classList.toggle('visually-hidden');
}

export { addListeners };
