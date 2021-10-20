import refs from './refs';

let isTop = true;
let isButtonClicked = false;
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
  if (window.scrollY < 1000) {
    isTop = true;
    if (!isButtonClicked) refs.scrollBtn.classList.add('is-hidden');
  } else {
    isTop = false;
    refs.scrollBtn.classList.remove('is-hidden');
  }
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
  refs.scrollBtn.addEventListener('click', () => {
    isButtonClicked = true;
    scroll();
  });
}

export {initScrollBtn, checkIsTop};