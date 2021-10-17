import loginHtml from '../../html-partials/authentication.html'
import refs from '../refs';
import { firebaseApp, database } from './firebase-app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { getFirestore, collection, addDoc, doc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { getDatabase, ref, child, get } from "firebase/database";
import {toggleModal, insertModalHtml, onClearHtml, movieID} from '../modal'


refs.loginLink.addEventListener('click', createLoginModal)


const db = getFirestore();
const realTimeDatabase = getDatabase();
const auth = getAuth();
getMovieId();


function signUp() {
  // const emailInput = document.getElementById('email');
  // const passwordInput = document.getElementById('password');
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user);
    toggleModal();
    Notiflix.Report.success( 'You are successfully signed up' );
    addToDatabase(user.uid, user.email);
  })
  .catch((error) => {
    
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
  });
}

function signIn() {
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    Notiflix.Report.success( 'You are successfully logged in' ); 
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    Notiflix.Notify.failure(`${errorMessage}`)
  });
}
let uid;
onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    Notiflix.Notify.success(`Hello, ${uid}`)
  } else {
    //location.replace("index.html")
    console.log('You are not allowed to be here');
  }
});


function signOut() {
  auth.signOut();
  Notiflix.Notify.success( 'You are successfully logged out' ); 
}
let docRef;
async function addToDatabase(userId, mail) {
  
  try {
    docRef = await addDoc(collection(db, "user"), {
      first: "Ada",
      mail: mail,
      userId: userId,
      watched: [],
      queue: []
    });
    console.log(docRef);
  } catch (e) {
    console.error("Error adding document: ", e);
  } 
}
function createLoginModal() {
  refs.closeModalBtn.addEventListener('click', onClearHtml);
  insertModalHtml(loginHtml);
  toggleModal();
  addListeners();
}

function addListeners() {
  const loginForm = document.getElementById("login-form");
  const signUpBtn = document.querySelector('.sign-up');
  const signInBtn = document.querySelector('.sign-in');
  //const signOutBtn = document.getElementById('sign-out');
  
  loginForm.addEventListener("submit",(event)=>{
    event.preventDefault()
  })
  signUpBtn.addEventListener('click', signUp);
  signInBtn.addEventListener('click', signIn);
  //signOutBtn.addEventListener('click', signOut);
}
console.log(movieID);
async function addToWatched(movieID) { 
  try {
    await updateDoc(docRef, {
      watched: arrayUnion(movieID)
    });
    Notiflix.Notify.success('The movie successfully added to the watched list')
  } catch (e) {
    //console.error("Error adding document: ", e);
    console.log(e);
    Notiflix.Notify.failure(e)
  } 
}

async function addToQueue() {
  const movieId = getMovieId();
  console.log(movieId);
  try {
    await updateDoc(docRef, {
      queue: arrayUnion(movieId)
  });
    Notiflix.Notify.success('The movie successfully added to the queue')
  } catch (e) {
    console.error("Error adding document: ", e);
  } 
}

function getMovieId() {
  const realTimeDBRef = ref(getDatabase());
get(child(realTimeDBRef, `films/movieId`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
    return snapshot.val();
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
}

export{addToQueue, addToWatched, realTimeDatabase}
