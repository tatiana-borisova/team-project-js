import fetchData from '../fetchData.js';

export default async function fetchGenre() {
  const fetchType = '/genre';
  const mediaType = '/movie';
  const specificType = '/list';
  const lang = '&language=en';

  const promise = await fetchData(fetchType, mediaType, specificType, lang);
  return promise.genres;
}
