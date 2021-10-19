import refs from '../refs';
import {firebaseApp, database} from './firebase-app'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Notiflix from 'notiflix';
import {doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { ref, child, get } from "firebase/database";
import {toggleModal, createLoginModal} from '../modal'
import { firebaseConsts } from './firebase-vars';

refs.loginLink.addEventListener('click', createLoginModal)
refs.logoutLink.addEventListener('click', signOut)

onAuthStateChanged(firebaseConsts.auth, (user) => {
  if (user) {
    toggleLogLinks();
    refs.libraryLink.classList.remove('visually-hidden');
    firebaseConsts.userID = user.uid;
    firebaseConsts.email = user.email;
    firebaseConsts.databaseRef = doc(firebaseConsts.fireStoreDatabase, 'user', firebaseConsts.userID )
    Notiflix.Notify.success(`Hello, ${firebaseConsts.email}`)
  } 
});

async function signUp() {
  firebaseConsts.email = document.getElementById('email').value;
  firebaseConsts.password = document.getElementById('password').value;
  await createUserWithEmailAndPassword(firebaseConsts.auth, firebaseConsts.email, firebaseConsts.password)
    .then((userCredential) => {
      const user = userCredential.user;
      addUserToDatabase(user.uid, user.email);
      refs.libraryLink.classList.remove('visually-hidden');
      toggleModal();
    Notiflix.Report.success( 'You are successfully signed up' );
  })
  .catch((error) => {
    Notiflix.Notify.failure(error.message);
  });
}

async function signIn() {
  firebaseConsts.email = document.getElementById('email').value;
  firebaseConsts.password = document.getElementById('password').value;
  await signInWithEmailAndPassword(firebaseConsts.auth, firebaseConsts.email, firebaseConsts.password)
    .then((userCredential) => {
      toggleModal();
    refs.libraryLink.classList.remove('visually-hidden');
    Notiflix.Report.success( 'You are successfully logged in' ); 
  })
  .catch((error) => {
    Notiflix.Notify.failure(error.message)
  });
}

function signOut() {
  firebaseConsts.auth.signOut();
  toggleLogLinks();
  refs.libraryLink.classList.add('visually-hidden');
  Notiflix.Notify.success( 'You are successfully logged out' ); 
}

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

function addListeners() {
  const loginForm = document.getElementById("login-form");
  const signUpBtn = document.querySelector('.sign-up');
  const signInBtn = document.querySelector('.sign-in');
  
  loginForm.addEventListener("submit",(event)=>{
    event.preventDefault()
  })
  signUpBtn.addEventListener('click', signUp);
  signInBtn.addEventListener('click', signIn);
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

function toggleLogLinks() {
  
      refs.loginLink.classList.toggle('visually-hidden');
      refs.logoutLink.classList.toggle('visually-hidden');
}

export{addToQueue, addToWatched, addListeners}

  