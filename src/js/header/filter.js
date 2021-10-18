import SlimSelect from 'slim-select';
import fetchGenre from '../functions/fetchDataByType/fetchGenre';
import fetchDiscover from '../functions/fetchDataByType/fetchDiscover';
import { mainMarkup } from '../container/mainMarkup';

import filmCards from '../../templates/film-card.hbs';
import refs from '../refs';
import { apiVariables } from '../apiVariables';

let select = new SlimSelect({
  select: '#multiple',
  closeOnSelect: false,
  placeholder: 'Filter by genres',
  onChange: async values => {
    apiVariables.page = 1;
    refs.gallery.innerHTML = '';
    let value = values.map(value => {
      return value.value;
    });
    const genresData = await fetchGenre();
    let genresValues = value.map(val => {
      return genresData.find(genreData => {
        return genreData.name === val;
      }).id;
    });
    apiVariables.genres = genresValues.join(',');
    if (apiVariables.genres !== '') {
      filterMarkup();
    } else {
      apiVariables.page = 1;
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

export default async function filterMarkup() {
  const genresData = await fetchGenre();
  let discoveringFilms = await fetchDiscover(
    apiVariables.page,
    apiVariables.genres,
  );
  const discoveringFilmsData = discoveringFilms.map(film => {
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
    if (film.release_date) {
      film.release_date = film.release_date.slice(0, 4);
    }

    return film;
  });

  refs.gallery.insertAdjacentHTML('beforeend', filmCards(discoveringFilmsData));
}
