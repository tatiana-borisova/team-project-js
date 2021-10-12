import { firebaseApp, database } from './firebase-app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged } from "firebase/auth";


document.getElementById("loginForm").addEventListener("submit",(event)=>{
    event.preventDefault()
})

const auth = getAuth();
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signUpBtn = document.querySelector('.sign-up');
const signInBtn = document.querySelector('.sign-in');
signUpBtn.addEventListener('click', signUp)
signInBtn.addEventListener('click', signIn)

function signUp() {
    const email = emailInput.value;
    const password = passwordInput.value;
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
      const user = userCredential.user;
      signInBtn.classList.add('is-hidden');
      signUpBtn.classList.add('is-hidden');
      alert('success')
    // ...
  })
    .catch((error) => {
      
    const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
    // ..
  });
}

function signIn() {
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
      const user = userCredential.user;
      alert('success')
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      alert('you are logged in')
      //document.getElementById("user").innerHTML = "Hello, "+user.email
    // ...
  } else {
      //location.replace("index.html")
      console.log('You are not allowed to be here');
    // User is signed out
    // ...
  }
});


function logout() {
    
    auth.signOut()
}