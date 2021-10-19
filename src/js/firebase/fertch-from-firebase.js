import { fireStoreDatabase, uid } from './firebase-auth';
import { doc, getDoc } from "firebase/firestore";
import { firebaseConsts } from './firebase-vars';
import refs from '../refs'
import movieCardTmpl from '../../templates/film-card.hbs'

const myLibrary = document.querySelector('.header-links__link--library.link')
//const docRef = doc(firebaseConsts.fireStoreDatabase, "user", firebaseConsts.userID);
myLibrary.addEventListener('click', getFilms)
async function getFilms() {
    console.log('i m here');
    refs.gallery.innerHTML = '';
    const docSnap = await getDoc(firebaseConsts.databaseRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data().watched);
        const watchedMovies = docSnap.data().watched.map(movie => {
            
            console.log(movie.genres);
            console.log(movie.genres.name);
            movie.genres = movie.genres.map(genre => genre.name).join(', ')
            return movie
        })
        console.log(watchedMovies);
        refs.gallery.innerHTML = movieCardTmpl(watchedMovies)

    } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    }
}





/* const unsub = onSnapshot(doc(fireStoreDatabase, "user", uid), (fireStoreDatabase) => {
    console.log("Current data: ", fireStoreDatabase.data());
});
console.log(unsub); */