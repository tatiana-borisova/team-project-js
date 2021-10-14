import fetchData from '../fetchData.js';

export default async function fetchSearch(
  query = 'injustice',
  lang = 'en',
  page = 1,
) {
  const queryType = '&query=';
  query = queryType + query;
  const fetchType = '/search';
  const timeWindow = '';
  const genre = '';
  const mediaType = '/movie';
  const promise = await fetchData(
    fetchType,
    mediaType,
    timeWindow,
    query,
    lang,
    page,
    genre,
  );
  const data = promise.results;
  console.log(data);
  return data;
}
