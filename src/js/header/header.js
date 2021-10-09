import refs from '../refs';

refs.homeLink.addEventListener('click', onHomeEl);
refs.libraryLink.addEventListener('click', onLibraryEl);

function onHomeEl(e) {
  e.preventDefault();
  refs.libraryBtns.classList.add('is-hidden');
  refs.searchForm.classList.remove('is-hidden');
}
function onLibraryEl(e) {
  e.preventDefault();
  refs.libraryBtns.classList.remove('is-hidden');
  refs.searchForm.classList.add('is-hidden');
}
