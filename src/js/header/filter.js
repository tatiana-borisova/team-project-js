import SlimSelect from 'slim-select';
import fetchGenre from '../functions/fetchDataByType/fetchGenre';

export default function filterByGenre(params) {
  let select = new SlimSelect({
    select: '#multiple',
    closeOnSelect: false,
    placeholder: 'Filter by genre',
    onChange: info => {
      console.log(info);
    },
  });
  setGenresList();
  async function setGenresList() {
    let genres = await fetchGenre();
    let genresNames = genres.map(genre => {
      genre.text = genre.name;
      delete genre.id;
      delete genre.name;
      return genre;
    });
    select.setData(genresNames);
  }
}

// let filterElems = select.selected();
