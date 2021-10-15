import fetchData from '../fetchData.js';

export default async function fetchTrending(pageValue = 1) {
  const fetchType = '/trending';
  const mediaType = '/movie';
  const timeWindow = '/day';
  const lang = '&language=en';
  let page = `&page=${pageValue}`;

  const promise = await fetchData(fetchType, mediaType, timeWindow, lang, page);
  return promise.results;
}
