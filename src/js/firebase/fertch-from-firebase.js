import { fireStoreDatabase, uid } from './firebase-auth';
import { doc, getDoc } from "firebase/firestore";
import { firebaseConsts } from './firebase-vars';

const myLibrary = document.querySelector('.header-links__link--library.link')
//const docRef = doc(firebaseConsts.fireStoreDatabase, "user", firebaseConsts.userID);
myLibrary.addEventListener('click', getFilms)
async function getFilms() {
    console.log('i m here');
    const docSnap = await getDoc(firebaseConsts.databaseRef);

    if (docSnap.exists()) {
    console.log("Document data:", docSnap.data().watched);
    } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    }
}





/* const unsub = onSnapshot(doc(fireStoreDatabase, "user", uid), (fireStoreDatabase) => {
    console.log("Current data: ", fireStoreDatabase.data());
});
console.log(unsub); */