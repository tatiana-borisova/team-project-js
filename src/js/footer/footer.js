import refs from '../refs';

const {footer} = refs;

window.onscroll = function() {showFooter()};

const sticky = footer.offsetBottom = footer.offsetTop + footer.offsetHeight + 1000;

function showFooter() {
    if (window.pageYOffset >= sticky) {
      footer.classList.add("footer--visible");
    } else {
      footer.classList.remove("footer--visible");
    }
  }