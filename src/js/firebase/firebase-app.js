import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyCw4Y3q73TKMYE55JsFEcKyXbS0tzQK49I",
  authDomain: "team-project-js-f466b.firebaseapp.com",
  projectId: "team-project-js-f466b",
  storageBucket: "team-project-js-f466b.appspot.com",
  messagingSenderId: "958952460474",
  appId: "1:958952460474:web:53cbaa1f16e63288b43283",
    measurementId: "G-XK9DLL5BX7",
    databaseURL: "https://team-project-js-f466b-default-rtdb.europe-west1.firebasedatabase.app/",
  storageBucket: "gs://team-project-js-f466b.appspot.com/"

};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

export {firebaseApp, database}