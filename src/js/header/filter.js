import SlimSelect from 'slim-select';
import fetchGenre from '../functions/fetchDataByType/fetchGenre';
import fetchDiscover from '../functions/fetchDataByType/fetchDiscover';
import filmCards from '../../templates/film-card.hbs';
import refs from '../refs';

export default function filterByGenre(page) {
  let select = new SlimSelect({
    select: '#multiple',
    closeOnSelect: false,
    placeholder: 'Filter by genre',
    onChange: async values => {
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
      let discoveringFilms = await fetchDiscover(page, genres);
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
        film.release_date = film.release_date.slice(0, 4);

        return film;
      });

      refs.gallery.insertAdjacentHTML(
        'beforeend',
        filmCards(discoveringFilmsData),
      );
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
