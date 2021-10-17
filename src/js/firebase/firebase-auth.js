import loginHtml from '../../html-partials/authentication.html'
import refs from '../refs';
import { firebaseApp, database } from './firebase-app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { getFirestore, collection, addDoc, doc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import {toggleModal, insertModalHtml, onClearHtml, movieID} from '../modal'


refs.loginLink.addEventListener('click', createLoginModal)


const fireStoreDatabase = getFirestore();
const realTimeDatabase = getDatabase();
const auth = getAuth();


function signUp() {
  // const emailInput = document.getElementById('email');
  // const passwordInput = document.getElementById('password');
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
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
    docRef = await addDoc(collection(fireStoreDatabase, "user"), {
      mail: mail,
      userId: userId,
      watched: [],
      queue: []
    });
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

async function addToWatched(movieID) { 
  const movieId = get(child(ref(realTimeDatabase), `films/movieId`)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();  
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  movieId.then(data => {
    try {
      updateDoc(docRef, {
        watched: arrayUnion(data)
    });
      Notiflix.Notify.success('The movie successfully added to the queue')
    } catch (e) {
      console.error("Error adding document: ", e);
      }
  })
  
}

function addToQueue() {
  const movieId = get(child(ref(realTimeDatabase), `films/movieId`)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val(); 
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  movieId.then(data => {
    try {
      updateDoc(docRef, {
        queue: arrayUnion(data)
    });
      Notiflix.Notify.success('The movie successfully added to the queue')
    } catch (e) {
      console.error("Error adding document: ", e);
      }
  })
  
}

/* function getMovieId() {
 
  get(child(ref(realTimeDatabase), `films/movieId`)).then((snapshot) => {
    if (snapshot.exists()) {
      const movieId = snapshot.val();
      console.log(movieId);
      return movieId;  
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
} */

export{addToQueue, addToWatched, realTimeDatabase, fireStoreDatabase}




/* return onValue(ref(realTimeDatabase, '/films/'), (snapshot) => {
  const movieId = (snapshot.val() && snapshot.val().movieId) || Notiflix.Notify.failure('This is errrrroorr');
  console.log(movieId);
  // ...
}, {
  onlyOnce: true
}); */
  