import refs from '../refs';
import fetchSearch from '../functions/fetchSearch';
import fetchGenre from '../functions/fetchGenre';

import filmCards from '../../templates/film-card.hbs';

refs.homeLink.addEventListener('click', onHomeLink);
refs.libraryLink.addEventListener('click', onLibraryLink);
refs.searchForm.addEventListener('submit', onSearch);

let lang = 'en';
let page = '1';
let mediaType = '/movie';
let specificType = '/list';

function onHomeLink(e) {
  e.preventDefault();
  refs.libraryBtns.classList.add('is-hidden');
  refs.searchForm.classList.remove('is-hidden');
  refs.libraryLink.classList.remove('header-links__link--current');
  refs.homeLink.classList.add('header-links__link--current');
}
function onLibraryLink(e) {
  e.preventDefault();
  refs.libraryBtns.classList.remove('is-hidden');
  refs.searchForm.classList.add('is-hidden');
  refs.homeLink.classList.remove('header-links__link--current');
  refs.libraryLink.classList.add('header-links__link--current');
}
async function onSearch(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  const query = e.target.elements.query.value;
  let searchFilms = await fetchSearch(query, lang, page);
  const genresData = await fetchGenre(mediaType, specificType, lang);
  const searchFilmsData = searchFilms.map(film => {
    film.genres = film.genre_ids.map(
      genreId => genresData.find(genre => genre.id === genreId).name,
    );
    return film;
  });
  console.log(searchFilmsData);

  refs.gallery.insertAdjacentHTML('beforeend', filmCards(searchFilmsData));
}
