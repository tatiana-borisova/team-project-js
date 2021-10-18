import fetchTrending from '../functions/fetchDataByType/fetchTrending';
import fetchSearch from '../functions/fetchDataByType/fetchSearch';
import fetchGenre from '../functions/fetchDataByType/fetchGenre';
import 'js-loading-overlay';
import filmCards from '../../templates/film-card.hbs';
import debounce from 'lodash.debounce';
import refs from '../refs';
import { changeLanguage } from '../translate';
import { elements } from '../elementsObj';
let mediaType = '/movie';
let timeWindow = '/day';
let specificType = '/list';

let page = 1;
let query = '';
// let { lang, mediaType, timeWindow, specificType, page, query } = elements;
refs.searchForm.addEventListener('submit', onSearch);
changeLanguage();
///////////////////////
function onSearch(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  query = e.target.query.value;

  searchMarkup(query);
}

async function searchMarkup(query) {
  let searchFilms = await fetchSearch(query, elements.lang, page);
  const genresData = await fetchGenre(mediaType, specificType, elements.lang);
  const searchFilmsData = searchFilms.map(film => {
    film.genres = film.genre_ids.map(
      genreId => genresData.find(genre => genre.id === genreId).name,
    );
    // условие чтоб обрезало жанры до двух , а остальным писало other
    if (film.genres.length > 3) {
      film.genres = film.genres.splice(0, 2).join(', ') + otherGenresLang();
    } else {
      film.genres = film.genres.join(', ');
    }
    // обрезает также дату
    film.release_date = film.release_date && film.release_date.slice(0, 4);

    return film;
  });
  refs.gallery.insertAdjacentHTML('beforeend', filmCards(searchFilmsData));
}
function otherGenresLang() {
  if (elements.lang === 'en') {
    return ', Other';
  } else {
    return ', другие';
  }
}
async function mainMarkup() {
  let trendingFilms = await fetchTrending(
    mediaType,
    timeWindow,
    elements.lang,
    page,
  );

  const genresData = await fetchGenre(mediaType, specificType, elements.lang);
  const trendingFilmsData = trendingFilms.map(film => {
    film.genres = film.genre_ids.map(
      genreId => genresData.find(genre => genre.id === genreId).name,
    );
    // условие чтоб обрезало жанры до двух , а остальным писало other
    if (film.genres.length > 3) {
      film.genres = film.genres.splice(0, 2).join(', ') + otherGenresLang();
    } else {
      film.genres = film.genres.join(', ');
    }
    // обрезает также дату
    film.release_date = film.release_date && film.release_date.slice(0, 4);

    return film;
  });

  refs.gallery.insertAdjacentHTML('beforeend', filmCards(trendingFilmsData));
}
mainMarkup();
/////////////////////////////////////////////////////////
// infinity scroll and loader(не забудьте установить пакет для loadera)
function spinerParams() {
  JsLoadingOverlay.show({
    spinnerIcon: 'ball-spin',
    overlayBackgroundColor: '#666666',
    overlayOpacity: 0.2,
    spinnerColor: '#fff',
    spinnerSize: '2x',
    overlayIDName: 'overlay',
    spinnerIDName: 'spinner',
  });
}
function infinityScrollLoad() {
  window.addEventListener(
    'scroll',
    debounce(() => {
      const infinityOn = document.documentElement.getBoundingClientRect();
      if (infinityOn.bottom < document.documentElement.clientHeight + 150) {
        page++;
        spinerParams();
        setTimeout(() => {
          if (query === '') {
            mainMarkup();
          } else {
            searchMarkup(query);
          }
          JsLoadingOverlay.hide();
        }, 250);
      }
    }, 250),
  );
}
infinityScrollLoad();
