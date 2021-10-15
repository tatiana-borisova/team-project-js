import { firebaseApp, database } from './firebase-app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { getFirestore, collection, addDoc } from "firebase/firestore"
import toggleModal from '../modal'

document.getElementById("login-form").addEventListener("submit",(event)=>{
    event.preventDefault()
})
const db = getFirestore();
const auth = getAuth();
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signUpBtn = document.querySelector('.sign-up');
const signInBtn = document.querySelector('.sign-in');
const signOutBtn = document.getElementById('sign-out');
signUpBtn.addEventListener('click', signUp);
signInBtn.addEventListener('click', signIn);
signOutBtn.addEventListener('click', signOut);

function signUp() {
    const email = emailInput.value;
    const password = passwordInput.value;
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user);
    toggleModal();
    Notiflix.Report.success( 'You are successfully signed up' );
    addToDatabase(user, userCredential.mail);
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

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
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

async function addToDatabase(userId, mail) {
  try {
    const docRef = await addDoc(collection(db, "user"), {
      first: "Ada",
      mail: mail,
      userId: userId
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  } 
}