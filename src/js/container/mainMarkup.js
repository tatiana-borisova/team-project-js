import fetchTrending from '../functions/fetchDataByType/fetchTrending';
import fetchGenre from '../functions/fetchDataByType/fetchGenre';
import 'js-loading-overlay';
import filmCards from '../../templates/film-card.hbs';

import refs from '../refs';

let mediaType = '/movie';
let timeWindow = '/day';
let specificType = '/list';
let lang = 'en';
let page = 1;

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
window.addEventListener('scroll', () => {
  const baba = document.documentElement.getBoundingClientRect();
  if (baba.bottom < document.documentElement.clientHeight + 150) {
    page++;
    JsLoadingOverlay.show({
      spinnerIcon: 'ball-spin',
      overlayBackgroundColor: '#666666',
      overlayOpacity: 0.2,
      spinnerColor: '#fff',
      spinnerSize: '2x',
      overlayIDName: 'overlay',
      spinnerIDName: 'spinner',
    });
    setTimeout(() => {
      mainMarkup();
      JsLoadingOverlay.hide();
    }, 250);
  }
});
