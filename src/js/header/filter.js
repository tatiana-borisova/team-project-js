import SlimSelect from 'slim-select';
import { mainMarkup } from '../container/mainMarkup';

import filmCards from '../../templates/film-card.hbs';
import refs from '../refs';

import { apiVariables } from '../apiVariables';
import { fetchDiscover, fetchGenre } from '../fetch-api';

export default function filterByGenre() {
  let select = new SlimSelect({
    select: '#multiple',
    closeOnSelect: false,
    placeholder: 'Filter by genre',
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
      let genres = genresValues.join(',');
      localStorage.setItem('genres', genres);
      let genresLocal = localStorage.getItem('genres');
      console.log('local: ' + genresLocal);
      let query = localStorage.getItem('query');
      if (query === null) {
        query = '';
      }

      if (genresLocal !== '' || query !== '') {
        console.log('filterMarkup - page:' + apiVariables.page);
        let discoveringFilms = await fetchDiscover(
          apiVariables.page,
          genresLocal,
          query,
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

        refs.gallery.insertAdjacentHTML(
          'beforeend',
          filmCards(discoveringFilmsData),
        );
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
}
