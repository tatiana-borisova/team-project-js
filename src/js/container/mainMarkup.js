import fetchTrending from '../functions/fetchTrending';
import fetchGenre from '../functions/fetchGenre';

import filmCards from '../../templates/film-card.hbs';

import refs from '../refs';

let mediaType = 'movie';
let timeWindow = 'day';
let specificType = 'list';
let lang = 'en';
let page = 1;

async function mainMarkup() {
  let trendingFilms = await fetchTrending(mediaType, timeWindow, lang, page);
  const genresData = await fetchGenre(mediaType, specificType, lang);
  const trendingFilmsData = trendingFilms.map(film => {
    film.genres = film.genre_ids.map(
      genreId => genresData.find(genre => genre.id === genreId).name,
    );
    return film;
  });
  console.log(trendingFilmsData);

  refs.gallery.insertAdjacentHTML('beforeend', filmCards(trendingFilmsData));
}
mainMarkup();
