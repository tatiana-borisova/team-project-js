import refs from '../refs';
import fetchSearch from '../functions/fetchDataByType/fetchSearch';
import fetchGenre from '../functions/fetchDataByType/fetchGenre';

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

  refs.headerBackground.classList.remove('header-background--library');
  refs.headerBackground.classList.add('header-background--home');

  refs.libraryLink.classList.remove('header-links__link--current');
  refs.homeLink.classList.add('header-links__link--current');
}
function onLibraryLink(e) {
  e.preventDefault();
  refs.libraryBtns.classList.remove('is-hidden');
  refs.searchForm.classList.add('is-hidden');

  refs.headerBackground.classList.remove('header-background--home');
  refs.headerBackground.classList.add('header-background--library');

  refs.homeLink.classList.remove('header-links__link--current');
  refs.libraryLink.classList.add('header-links__link--current');
}
async function onSearch(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  const query = e.target.elements.query.value;
  let searchFilms = await fetchSearch(page, query);
  const genresData = await fetchGenre();
  const searchFilmsData = searchFilms.map(film => {
    film.genres = film.genre_ids
      .map(genreId => genresData.find(genre => genre.id === genreId).name)
      // обрезает количество жанров
      .splice(0, 3)
      .join(', ');
    // обрезает дату
    if (!film.release_date) {
      film.release_date = '';
    } else {
      film.release_date = film.release_date.slice(0, 4);
    }
    return film;
  });

  refs.gallery.insertAdjacentHTML('beforeend', filmCards(searchFilmsData));
}
