import refs from './refs';

let isTop = true;
let savedPosition;

function scroll() {
  if (isTop) {
    window.scrollTo({ top: savedPosition, behavior: 'smooth'});
  } else {
    savedPosition = window.scrollY;
    window.scrollTo({ top: 0, behavior: 'smooth'});
  }
}

function checkIsTop() {
  changeScrollBtn();
  isTop = window.scrollY < 1000 ? true : false;
}

function changeScrollBtn() {
  if (isTop) {
    refs.scrollBtn.classList.add('arrow-down');
  } else {
    refs.scrollBtn.classList.remove('arrow-down', 'is-hidden');
  }
}

function initScrollBtn() {
  changeScrollBtn();
  refs.scrollBtn.addEventListener('click', scroll);
}

export {initScrollBtn, checkIsTop};