import refs from '../refs';

refs.homeLink.addEventListener('click', onHomeLink);
refs.libraryLink.addEventListener('click', onLibraryLink);

function onHomeLink(e) {
  e.preventDefault();
  refs.libraryBtns.classList.add('is-hidden');
  refs.searchForm.classList.remove('is-hidden');

  refs.headerBackground.classList.remove('header-background__library');
  refs.headerBackground.classList.add('header-background');

  refs.libraryLink.classList.remove('header-links__link--current');
  refs.homeLink.classList.add('header-links__link--current');
}
function onLibraryLink(e) {
  e.preventDefault();
  refs.libraryBtns.classList.remove('is-hidden');
  refs.searchForm.classList.add('is-hidden');

  refs.headerBackground.classList.remove('header-background');
  refs.headerBackground.classList.add('header-background__library');

  refs.homeLink.classList.remove('header-links__link--current');
  refs.libraryLink.classList.add('header-links__link--current');
}
