import { filterSelect, filterMarkup } from '../header/filter';
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
import { changeLanguage, notifySearchError } from '../translate';
import { initScrollBtn, checkIsTop } from '../scroll';

fetchApi.markupedMovies = [];
mainMarkup();

refs.searchForm.addEventListener('submit', onSearch);
changeLanguage();
///////////////////////
function onSearch(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  filterSelect.set([]);
  fetchApi.page = 1;
  fetchApi.query = e.target.elements.query.value;
  fetchApi.markupedMovies = [];
  searchMarkup();
}
async function searchMarkup() {
  let searchFilms = await fetchSearch();
  if (searchFilms.length === 0 && fetchApi.page === 1) {
    notifySearchError();
  }
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
  // console.log(await addGenresToData(await fetchTrending()));
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
  const infinityOn = document.documentElement.getBoundingClientRect();
  if (infinityOn.bottom < document.documentElement.clientHeight + 150) {
    fetchApi.page++;
    spinerParams();
    setTimeout(() => {
      if (!refs.searchForm.classList.contains('is-hidden')) {
        if (fetchApi.query === '' && fetchApi.genres === '') {
          mainMarkup();
        } else if (fetchApi.query !== '') {
          searchMarkup();
        } else {
          filterMarkup();
        }
      }

      JsLoadingOverlay.hide();
    }, 250);
  }
}

// вынесла debounce infinityScrollLoad в отдельную переменную, в которую записывается результат,
let loadMore = debounce(infinityScrollLoad, 250);

//  а потом ниже ее вызываем иначе при скроле загрумалось сразу очень много фильмов
checkIsTop();
initScrollBtn();

//  а потом а window повесила и ее и стрелку
window.addEventListener('scroll', () => {
  loadMore();
  checkIsTop();
});

export async function addGenresToData(data) {
  const genresData = await fetchGenre();
  // console.log(fetchApi.markupedMovies);
  // fetchApi.markupedMovies = [];
  return data.filter((film, idx, array) => {
    film.genres = film.genre_ids.map(
      genreId => genresData.find(genre => genre.id === genreId).name,
    );
    // условие чтоб обрезало жанры до двух , а остальным писало other
    if (film.genres.length === 0) {
      const otherGenres = otherGenresLang();
      film.genres = otherGenres.slice(2);
    } else if (film.genres.length > 3) {
      film.genres = film.genres.splice(0, 2).join(', ') + otherGenresLang();
    } else {
      film.genres = film.genres.join(', ');
    }
    // обрезает также дату
    film.release_date = film.release_date && film.release_date.slice(0, 4);
    // проверка нет ли одинаковых фильмов, начинается со второй страницы
    if (fetchApi.page === 1) fetchApi.markupedMovies.push(film);
    if (fetchApi.page > 1) {
      if (fetchApi.markupedMovies.find(movie => movie.id === film.id))
        return false;
      fetchApi.markupedMovies.push(film);
    }
    return film;
  });
}
// infinityScrollLoad();
