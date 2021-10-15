import SlimSelect from 'slim-select';
import fetchGenre from '../functions/fetchDataByType/fetchGenre';
import fetchDiscover from '../functions/fetchDataByType/fetchDiscover';

export default function filterByGenre(page) {
  let select = new SlimSelect({
    select: '#multiple',
    closeOnSelect: false,
    placeholder: 'Filter by genre',
    onChange: values => {
      console.log(
        values.map(value => {
          return value;
        }),
      );
      // fetchGenre();
      // fetchDiscover(page, genres);
    },
  });
  setGenresList();
  async function setGenresList() {
    let genres = await fetchGenre();
    let genresNames = genres.map(genre => {
      genre.text = genre.name;
      // delete genre.id;
      delete genre.name;
      return genre;
    });
    console.log(genresNames);
    select.setData(genresNames);
  }
}

// let filterElems = select.selected();
