import refs from '../refs';

const {footer} = refs;

window.onscroll = function() {showFooter()};

const sticky = footer.offsetBottom = footer.offsetTop + footer.offsetHeight + 2000;

function showFooter() {
    if (window.pageYOffset >= sticky) {
      footer.classList.add("footer__sticky")
    } else {
      footer.classList.remove("footer__sticky");
    }
  }