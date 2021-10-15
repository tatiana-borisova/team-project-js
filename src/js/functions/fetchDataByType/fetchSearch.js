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
  const mediaType = '/movie';
  const promise = await fetchData(
    fetchType,
    mediaType,
    timeWindow,
    query,
    lang,
    page,
  );
  const data = promise.results;
  return data;
}
