import fetchData from '../fetchData.js';

export default async function fetchTrending(
  mediaType = '/movie',
  timeWindow = '/day',
  lang = 'en',
  page = 1,
) {
  const fetchType = '/trending';
  const query = '';
  const genre = '';
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
  return data;
}
