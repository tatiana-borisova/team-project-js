import SlimSelect from 'slim-select';
import { fetchGenre, fetchDiscover, fetchApi } from '../fetch-api.js';
import {
  mainMarkup,
  otherGenresLang,
  addGenresToData,
} from '../container/mainMarkup';
import filmCards from '../../templates/film-card.hbs';
import refs from '../refs';

let filterSelect = new SlimSelect({
  select: '#multiple',
  closeOnSelect: false,
  placeholder: 'Filter by genres',
  onChange: filter,
});
setGenresList();
async function filter(params) {
  {
    fetchApi.page = 1;
    refs.gallery.innerHTML = '';
    fetchApi.query = '';
    fetchApi.markupedMovies = [];
    let value = params.map(value => {
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
      mainMarkup();
    }
  }
}
async function setGenresList() {
  let genresData = await fetchGenre();
  let genresNames = genresData.map(genre => {
    genre.text = genre.name;
    delete genre.id;
    delete genre.name;
    return genre;
  });
  filterSelect.setData(genresNames);
}
export { setGenresList };
async function filterMarkup() {
  document.querySelector('.header-form__form').reset();
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    filmCards(await addGenresToData(await fetchDiscover())),
  );
}

export { filterSelect, filterMarkup };
