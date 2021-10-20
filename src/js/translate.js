import { fetchApi } from './fetch-api';
import { setGenresList, filterSelect } from './header/filter';
import Notiflix from 'notiflix';
fetchApi.lang = 'ru';
const language = {
  home: {
    en: 'home',
    ru: 'Главная',
  },
  library: {
    en: 'My library',
    ru: 'Моя библиотека',
  },
  input: {
    en: 'Search movies...',
    ru: 'Поиск...',
  },
  watch: {
    en: 'Watched',
    ru: 'Просмотренные',
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
  login: {
    en: 'Login',
    ru: 'Войти',
  },
  password: {
    en: 'Password',
    ru: 'Пароль',
  },
  log: {
    en: 'Log out',
    ru: 'Выйти',
  },
  loginRu: {
    en: 'Login',
    ru: 'Регистрация',
  },
  form: {
    en: 'Form',
    ru: '',
  },
  loginUp: {
    en: 'Login',
    ru: 'Логин',
  },
  signUp: {
    en: 'Sign Up',
    ru: 'Войти',
  },
};
// console.log(fetchApi);
const allLang = ['en', 'ru'];
/////////////////////////
const select = document.querySelector('.select');
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
  // console.log(hash);
  if (!allLang.includes(hash)) {
    location.href = window.location.pathname + '#en';

    location.reload();
  }
  fetchApi.lang = hash;

  setGenresList();
  // console.log(fetchApi.lang);
  select.value = hash;
  for (let key in language) {
    let elem = document.querySelector('.lang-' + key);
    if (elem) {
      elem.innerHTML = language[key][hash];
    }
  }
}

changeLanguage();
setGenresList();
Notiflix.Notify.init({
  className: 'notiflix-notify',
  timeout: 3000,
  width: '220px',
  position: 'right-bottom',
  distance: '50px',
  closeButton: false,
});

function placeholderRu() {
  if (fetchApi.lang === 'ru') {
    filterSelect.config.placeholderText = 'Фильтр по жанрам';
  }
}
placeholderRu();
const translateLanguage = fetchApi.lang === 'en';
function notifyMovieFound() {
  if (translateLanguage) {
    Notiflix.Notify.failure('You have no saved movies');
  } else {
    Notiflix.Notify.failure('У вас еще нет сохраненных фильмов');
  }
}
function notifyLoginRu() {
  if (translateLanguage) {
    Notiflix.Notify.failure('You are not logged in');
  } else {
    Notiflix.Notify.failure('Вы не авторизованы');
  }
}
function notifyAccept() {
  if (translateLanguage) {
    Notiflix.Report.success('You are successfully signed up');
  } else {
    Notiflix.Report.success('Вы успешно зарегистрировались');
  }
}
function notifyLoggedIn() {
  if (translateLanguage) {
    Notiflix.Report.success('You are successfully logged in');
  } else {
    Notiflix.Report.success('Вы успешно вошли в систему');
  }
}
function notifyLoggedOut() {
  if (translateLanguage) {
    Notiflix.Notify.success('You are successfully logged out');
  } else {
    Notiflix.Notify.success('Вы успешно вышли из системы');
  }
}
function notifyAvailabe() {
  if (translateLanguage) {
    Notiflix.Notify.failure('No data available');
  } else {
    Notiflix.Notify.failure('Данные недоступны');
  }
}
function notifyMovieQueue() {
  if (translateLanguage) {
    Notiflix.Notify.success('The movie successfully added to the queue');
  } else {
    Notiflix.Notify.success('Фильм успешно добавлен в очередь');
  }
}
function notifyErrData() {
  if (translateLanguage) {
    Notiflix.Notify.failure('Error adding to database: ');
  } else {
    Notiflix.Notify.failure('Ошибка добавления в базу данных: ');
  }
}
function notifySearchError() {
  if (translateLanguage) {
    Notiflix.Notify.failure('No results for your request');
  } else {
    Notiflix.Notify.failure('Нет результатов по вашему запросу');
  }
}

export {
  changeLanguage,
  notifyMovieFound,
  notifyLoginRu,
  notifyAccept,
  notifyLoggedIn,
  notifyLoggedOut,
  notifyAvailabe,
  notifyMovieQueue,
  notifyErrData,
  notifySearchError,
};
