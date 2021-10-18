// import template from '../templates/movie-modal-templ.hbs';
import mainMarkup from './container/mainMarkup.js';
import fetchData from './functions/fetchData.js';

import { elements } from './elementsObj';
elements.lang = 'ru';
const language = {
  home: {
    en: 'home',
    ru: 'Главная',
  },
  library: {
    en: 'Library',
    ru: 'Моя библиотека',
  },
  input: {
    en: 'Search movies...',
    ru: 'Поиск...',
  },
  watch: {
    en: 'Watch',
    ru: 'Смотреть',
  },
  queue: {
    en: 'queue',
    ru: 'на очереди',
  },
  reserved: {
    en: 'All Rights Reserved',
    ru: 'Все права защищены',
  },
  develop: {
    en: 'Developed with',
    ru: 'Разработано с',
  },
};
console.log(elements);
const allLang = ['en', 'ru'];
/////////////////////////
const select = document.querySelector('select');
select.addEventListener('change', changeURLLanguage);
// перенаправление на url
function changeURLLanguage(e) {
  let lng = select.value;
  location.href = window.location.pathname + '#' + lng;

  location.reload();
}
function changeLanguage() {
  let hash = window.location.hash;
  hash = hash.substr(1);
  console.log(hash);
  if (!allLang.includes(hash)) {
    location.href = window.location.pathname + '#en';

    location.reload();
  }
  elements.lang = hash;
  console.log(elements.lang);
  select.value = hash;
  for (let key in language) {
    let elem = document.querySelector('.lang-' + key);
    if (elem) {
      elem.innerHTML = language[key][hash];
    }
  }
}

changeLanguage();
export { changeLanguage };
