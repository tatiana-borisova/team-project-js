import { select, filterMarkup } from '../header/filter';
import {
  fetchGenre,
  fetchSearch,
  fetchTrending,
  fetchApi,
} from '../fetch-api.js';
import 'js-loading-overlay';
import filmCards from '../../templates/film-card.hbs';
import debounce from 'lodash.debounce';
import refs from '../refs';
import { changeLanguage } from '../translate';

mainMarkup();

refs.searchForm.addEventListener('submit', onSearch);
changeLanguage();
///////////////////////
function onSearch(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  select.set([]);
  fetchApi.page = 1;
  fetchApi.query = e.target.elements.query.value;

  searchMarkup();
}

async function searchMarkup() {
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    filmCards(await addGenresToData(await fetchSearch())),
  );
}
function otherGenresLang() {
  if (fetchApi.lang === 'en') {
    return ', Other';
  } else {
    return ', другие';
  }
}
export { otherGenresLang };
export async function mainMarkup() {
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    filmCards(await addGenresToData(await fetchTrending())),
  );
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
        fetchApi.page++;
        spinerParams();
        setTimeout(() => {
          if (fetchApi.query === '' && fetchApi.genres === '') {
            // console.log('point');
            mainMarkup();
          } else if (fetchApi.query !== '') {
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
export async function addGenresToData(data) {
  const genresData = await fetchGenre();
  return data.map(film => {
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
}
infinityScrollLoad();
