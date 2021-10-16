import refs from './refs';

const { topBtn, downBtn } = refs;

window.onload = function () {
  window.onscroll = function () {
    if (window.pageYOffset > 5) {
      topBtn.classList.remove('is-hidden');
      downBtn.classList.add('is-hidden');
    } else {
      topBtn.classList.add('is-hidden');
      downBtn.classList.remove('is-hidden');
    }
  };

  let scrolled;
  topBtn.onclick = function () {
    scrolled = window.pageYOffset;
    window.scrollTo(0, 0);
  };
  downBtn.onclick = function () {
    if (scrolled > 0) {
      window.scrollTo(0, scrolled);
    }
  };
};
