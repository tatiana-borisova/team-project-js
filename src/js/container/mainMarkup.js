import { select, filterMarkup } from '../header/filter';
import { fetchGenre, fetchSearch, fetchTrending } from '../fetch-api.js';
import 'js-loading-overlay';
import filmCards from '../../templates/film-card.hbs';
import debounce from 'lodash.debounce';
import refs from '../refs';
import { apiVariables } from '../apiVariables';

mainMarkup();

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  select.set([]);
  apiVariables.query = '';
  apiVariables.page = 1;
  apiVariables.query = e.target.elements.query.value;

  searchMarkup();
}

async function searchMarkup() {
  let searchFilms = await fetchSearch(apiVariables.page, apiVariables.query);
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
    if (film.release_date) film.release_date = film.release_date.slice(0, 4);

    return film;
  });

  refs.gallery.insertAdjacentHTML('beforeend', filmCards(searchFilmsData));
}

export async function mainMarkup() {
  let trendingFilms = await fetchTrending(apiVariables.page);
  const genresData = await fetchGenre();
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
        apiVariables.page++;
        spinerParams();
        setTimeout(() => {
          if (apiVariables.query === '' && apiVariables.genres === '') {
            mainMarkup();
          } else if (apiVariables.query !== '') {
            searchMarkup();
          } else {
            filterMarkup();
          }
          JsLoadingOverlay.hide();
        }, 250);
      }
    }, 250),
  );
}
infinityScrollLoad();
