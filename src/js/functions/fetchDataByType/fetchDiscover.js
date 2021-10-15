import fetchData from '../fetchData';

export default async function fetchDiscover(pageValue, genresValue) {
  const fetchType = '/discover';
  const mediaType = '/movie';
  const specificType = '';
  const lang = '&language=en';
  let page = `&page=${pageValue}`;
  let genre = `&with_genres=${genresValue}`;
  let sortBy = '&sort_by=vote_average.desc';

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
