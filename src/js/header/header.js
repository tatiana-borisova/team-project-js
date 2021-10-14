import refs from '../refs';
import fetchGenre from '../functions/fetchDataByType/fetchGenre';

// import filmCards from '../../templates/film-card.hbs';

refs.homeLink.addEventListener('click', onHomeLink);
refs.libraryLink.addEventListener('click', onLibraryLink);

// let lang = 'en';
// let page = '1';
// let mediaType = '/movie';
// let specificType = '/list';

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
