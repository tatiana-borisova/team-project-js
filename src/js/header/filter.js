import SlimSelect from 'slim-select';
import { fetchGenre, fetchDiscover, fetchApi } from '../fetch-api.js';
import { mainMarkup, otherGenresLang } from '../container/mainMarkup';
import filmCards from '../../templates/film-card.hbs';
import refs from '../refs';

let select = new SlimSelect({
  select: '#multiple',
  closeOnSelect: false,
  placeholder: 'Filter by genres',

  onChange: async values => {
    fetchApi.page = 1;
    refs.gallery.innerHTML = '';
    fetchApi.query = '';
    let value = values.map(value => {
      return value.value;
    });
    const genresData = await fetchGenre();
    let genresValues = value.map(val => {
      return genresData.find(genreData => {
        return genreData.name === val;
      }).id;
    });
    fetchApi.genres = genresValues.join(',');
    if (fetchApi.genres !== '') {
      filterMarkup();
    } else if (fetchApi.query === '') {
      fetchApi.page = 1;
      console.log('filter');
      mainMarkup();
    }
  },
});
setGenresList();
async function setGenresList() {
  let genresData = await fetchGenre();
  let genresNames = genresData.map(genre => {
    genre.text = genre.name;
    delete genre.id;
    delete genre.name;
    return genre;
  });
  select.setData(genresNames);
}
export { setGenresList };
async function filterMarkup() {
  console.log('filterMarkup - page' + fetchApi.page);
  document.querySelector('.header-form__form').reset();
  const genresData = await fetchGenre();
  let discoveringFilms = await fetchDiscover();
  const discoveringFilmsData = discoveringFilms.map(film => {
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
    if (film.release_date) {
      film.release_date = film.release_date.slice(0, 4);
    }

    return film;
  });

  refs.gallery.insertAdjacentHTML('beforeend', filmCards(discoveringFilmsData));
}

export { select, filterMarkup };
