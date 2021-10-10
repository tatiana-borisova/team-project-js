import refs from '../refs';

refs.homeLink.addEventListener('click', onHomeEl);
refs.libraryLink.addEventListener('click', onLibraryEl);
refs.linkHome.addEventListener('click', onLinkHome);
refs.linkLibrary.addEventListener('click', onLinkLibrary);

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
function onLinkHome(e){
  refs.linkLibrary.classList.remove('link--current');
  refs.linkHome.classList.add('link--current');
}

function onLinkLibrary(e){
  refs.linkHome.classList.remove('link--current');
  refs.linkLibrary.classList.add('link--current');
}
