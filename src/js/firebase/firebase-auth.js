import { firebaseApp, database } from './firebase-app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import * as basicLightbox from 'basiclightbox';
import { getFirestore, collection, addDoc } from "firebase/firestore"

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
const logInLink = document.getElementById('login');
signUpBtn.addEventListener('click', signUp);
signInBtn.addEventListener('click', signIn);
signOutBtn.addEventListener('click', signOut);
logInLink.addEventListener('click', showLogIn)


const addToDatabase = async() => {
  try {
    const docRef = await addDoc(collection(db, "user"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
        console.log(docRef);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  } 
}

/* function showLogIn() {
  console.log('i am herre');
  const instance = basicLightbox.create(`
    <div class="login__modal">
  <h3 class="login__header">Login Form</h3>
  <form id="login-form" class="login__form">
    <input id="email" type="text" class="modal__input mail__input" required />
    <span class="login__placeholder">Email Id</span>

    <input
      id="password"
      type="password"
      class="modal__input password__input"
      required
    />
    <span class="login__placeholder">Password</span>

    <!-- <a href="#" onclick="forgotPass()">Forgot Password</a> -->
    <div class="login__buttons">
      <button type="submit" class="sign-in">Login</button>
      <button class="sign-up">Sign Up</button>
      <button class="sign-out is-hidden" id="sign-out">Log out</button>
    </div>
  </form>
  <a>Close</a>
</div>
`, {
    onShow: (instance) => {
        instance.element().querySelector('a').onclick = instance.close
    }
  })
  console.log(instance.show());
  instance.show()
} */

function signUp() {
    const email = emailInput.value;
    const password = passwordInput.value;
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user);
    signInBtn.classList.add('is-hidden');
    signUpBtn.classList.add('is-hidden');
    signOutBtn.classList.remove('is-hidden')
    Notiflix.Report.success( 'You are successfully signed up' );
    addToDatabase;
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
      alert(errorMessage)
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
      const uid = user.uid;
  } else {
      //location.replace("index.html")
      console.log('You are not allowed to be here');
  }
});


function signOut() {
  auth.signOut();
  Notiflix.Report.success( 'You are successfully logged out' ); 
}
