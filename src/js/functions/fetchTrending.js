import fetchData from './fetchData.js';

export default async function fetchTrending(
  mediaType = 'movie',
  timeWindow = 'day',
  lang = 'en',
  page = 1,
) {
  const fetchType = 'trending';
  const promise = await fetchData(fetchType, mediaType, timeWindow, lang, page);
  const data = promise.results;
  return data;
}
