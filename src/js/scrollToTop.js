import refs from './refs';

const { btnTop, btnDown } = refs;

window.onload = function () {
  window.onscroll = function () {
    if (window.pageYOffset > 5) {
      btnTop.classList.remove('is-hidden');
      btnDown.classList.add('is-hidden');
    } else {
      btnTop.classList.add('is-hidden');
      btnDown.classList.remove('is-hidden');
    }
  };

  let scrolled;
  btnTop.onclick = function () {
    scrolled = window.pageYOffset;
    window.scrollTo(0, 0);
  };
  btnDown.onclick = function () {
    if (scrolled > 0) {
      window.scrollTo(0, scrolled);
    }
  };
};
