import fetchData from '../fetchData.js';

export default async function fetchSearch(pageValue = 1, queryValue = '') {
  const fetchType = '/search';
  const specificType = '';
  const mediaType = '/movie';
  const lang = `&language=en`;
  let page = `&page=${pageValue}`;
  let query = `&query=${queryValue}`;

  const promise = await fetchData(
    fetchType,
    mediaType,
    specificType,
    lang,
    page,
    query,
  );
  return promise.results;
}
