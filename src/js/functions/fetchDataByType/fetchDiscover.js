import fetchData from '../fetchData';

export default async function fetchDiscover(pageValue, genresValue) {
  const fetchType = '/discover';
  const mediaType = '/movie';
  const specificType = '';
  const lang = '&language=en';
  // const sortBy = '&sort_by=vote_average.desc';
  const sortBy = '';
  let page = `&page=${pageValue}`;
  let genre;

  if (genresValue !== '') genre = `&with_genres=${genresValue}`;
  else genre = '';

  const promise = await fetchData(
    fetchType,
    mediaType,
    specificType,
    lang,
    page,
    genre,
    sortBy,
  );
  return promise.results;
}
