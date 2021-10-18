import loginHtml from '../../html-partials/authentication.html'
import refs from '../refs';
import { firebaseApp, database } from './firebase-app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { getFirestore, collection, addDoc, doc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { toggleModal, insertModalHtml, onClearHtml, movieID } from '../modal'
import { firebaseConsts } from './firebase-vars';
console.log(firebaseConsts);

refs.loginLink.addEventListener('click', createLoginModal)

/* firebaseConsts.fireStoreDatabase = getFirestore();
firebaseConsts.realTimeDatabase = getDatabase(); */
/* const fireStoreDatabase = getFirestore();
const realTimeDatabase = getDatabase(); */
//const auth = getAuth();
let docRef;
let uid;

onAuthStateChanged(firebaseConsts.auth, (user) => {
  if (user) {
    firebaseConsts.userID = user.uid;
    console.log(firebaseConsts.userID );
    firebaseConsts.databaseRef = doc(firebaseConsts.fireStoreDatabase, 'user', firebaseConsts.userID )
    console.log(typeof firebaseConsts.databaseRef);
    Notiflix.Notify.success(`Hello, ${firebaseConsts.userID }`)
  } else {
    //location.replace("index.html")
    console.log('You are not allowed to be here');
  }
});

function signUp() {
  // const emailInput = document.getElementById('email');
  // const passwordInput = document.getElementById('password');
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  createUserWithEmailAndPassword(firebaseConsts.auth, email, password)
    .then((userCredential) => {
    console.log(userCredential.providerId);
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
  signInWithEmailAndPassword(firebaseConsts.auth, email, password)
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



function signOut() {
  firebaseConsts.auth.signOut();
  Notiflix.Notify.success( 'You are successfully logged out' ); 
}


//let docRef;
async function addToDatabase(userId, mail) {
  try {
    firebaseConsts.databaseRef = doc(firebaseConsts.fireStoreDatabase, "user", userId)
    await setDoc(firebaseConsts.databaseRef, {
      mail: mail,
      userId: userId,
      watched: [],
      queue: []
    });
    console.log(firebaseConsts.databaseRef);
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

async function addToWatched() { 
  const movieId = get(child(ref(firebaseConsts.realTimeDatabase), `films/movie`)).then((snapshot) => {
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
      console.log(firebaseConsts.databaseRef);
      updateDoc(firebaseConsts.databaseRef, {
        watched: arrayUnion(data)
    });
      Notiflix.Notify.success('The movie successfully added to the queue')
    } catch (e) {
      console.error("Error adding document: ", e);
      }
  })
  
}

function addToQueue() {
  const movieId = get(child(ref(firebaseConsts.realTimeDatabase), `films/movie`)).then((snapshot) => {
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
      updateDoc(firebaseConsts.databaseRef, {
        queue: arrayUnion(data)
    });
      Notiflix.Notify.success('The movie successfully added to the queue')
    } catch (e) {
      console.error("Error adding document: ", e);
      }
  })
  
}

export{addToQueue, addToWatched}

  