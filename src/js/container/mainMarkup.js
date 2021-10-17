import filterByGenre from '../header/filter';
import {
  fetchGenre,
  fetchSearch,
  fetchTrending,
  fetchDiscover,
} from '../fetch-api.js';
import 'js-loading-overlay';
import filmCards from '../../templates/film-card.hbs';
import debounce from 'lodash.debounce';
import refs from '../refs';
import { apiVariables } from '../apiVariables';

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  apiVariables.query = e.target.elements.query.value;

  searchMarkup();
}

async function searchMarkup() {
  let searchFilms = await fetchSearch(1, 'en', apiVariables.query);
  const genresData = await fetchGenre();
  const searchFilmsData = searchFilms.map(film => {
    film.genres = film.genre_ids.map(
      genreId => genresData.find(genre => genre.id === genreId).name,
    );
    // условие чтоб обрезало жанры до двух, а остальным писало other
    if (film.genres.length > 3) {
      film.genres = film.genres.splice(0, 2).join(', ') + ', Other';
    } else {
      film.genres = film.genres.join(', ');
    }
    // обрезает также дату
    film.release_date = film.release_date && film.release_date.slice(0, 4);

    return film;
  });

  refs.gallery.insertAdjacentHTML('beforeend', filmCards(searchFilmsData));
}

async function mainMarkup() {
  let trendingFilms = await fetchTrending(mediaType, timeWindow, lang, page);
  const genresData = await fetchGenre(mediaType, specificType, lang);
  const trendingFilmsData = trendingFilms.map(film => {
    film.genres = film.genre_ids.map(
      genreId => genresData.find(genre => genre.id === genreId).name,
    );
    // условие чтоб обрезало жанры до двух , а остальным писало other
    if (film.genres.length > 3) {
      film.genres = film.genres.splice(0, 2).join(', ') + ', Other';
    } else {
      film.genres = film.genres.join(', ');
    }
    // обрезает также дату
    film.release_date = film.release_date.slice(0, 4);

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
          if (apiVariables.query === '') {
            mainMarkup();
          } else {
            searchMarkup();
          }
          JsLoadingOverlay.hide();
        }, 250);
      }
    }, 250),
  );
}
infinityScrollLoad();
