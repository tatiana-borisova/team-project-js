import fetchTrending from '../functions/fetchDataByType/fetchTrending';
import fetchSearch from '../functions/fetchDataByType/fetchSearch';
import fetchGenre from '../functions/fetchDataByType/fetchGenre';
import fetchDiscover from '../functions/fetchDataByType/fetchDiscover';
import filterByGenre from '../header/filter';
import 'js-loading-overlay';
import filmCards from '../../templates/film-card.hbs';
import debounce from 'lodash.debounce';
import refs from '../refs';

let page = 1;
let genres = '18,80';

mainMarkup();
filterByGenre(page, genres);
// fetchDiscover(page, genres);
let query = '';

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  query = e.target.elements.query.value;

  searchMarkup(query);
}

async function searchMarkup(query) {
  let searchFilms = await fetchSearch(query, lang, page);
  const genresData = await fetchGenre(mediaType, specificType, lang);
  const searchFilmsData = searchFilms.map(film => {
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

  refs.gallery.insertAdjacentHTML('beforeend', filmCards(searchFilmsData));
}

async function mainMarkup() {
  let trendingFilms = await fetchTrending(page);
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
