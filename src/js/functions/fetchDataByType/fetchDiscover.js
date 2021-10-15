import fetchData from '../fetchData';

export default async function fetchDiscover(pageValue, genresValue) {
  const fetchType = '/discover';
  const mediaType = '/movie';
  const specificType = '';
  const lang = '&language=en';
  let page = `&page=${pageValue}`;
  //   genresValue = genresValue.join('|');
  let genre = `&with_genres=${genresValue}`;

  const promise = await fetchData(
    fetchType,
    mediaType,
    specificType,
    lang,
    page,
    genre,
  );
  console.log(promise);
  return promise;
}
