import { API_KEY, URL } from '../consts';
import refs from '../refs'
import movieModalTempl from '../../templates/movie-modal-templ.hbs'

refs.gallery.addEventListener('click', fetchDataByID)

async function fetchDataByID(e) {
    const movieID = e.target.closest('li').id;
    console.log(movieID);
    try {
      const promise = await fetch(
        `${URL}/3/movie/${movieID}?api_key=${API_KEY}`,
      );
      if (!promise.ok) throw Error(promise.statusText);
      const data = await promise.json();
      console.log(data);
      console.log(movieModalTempl(data));
      refs.movieModal.innerHTML = movieModalTempl(data) 
    } catch (error) {
      console.log('Error:', error);
    }

 }


  