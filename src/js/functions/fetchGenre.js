import fetchData from './fetchData.js';

export default async function fetchGenre(
  mediaType = '/movie',
  specificType = '/list',
  lang = 'en',
) {
  const fetchType = '/genre';
  const page = 1;
  const query = '';

  const promise = await fetchData(
    fetchType,
    mediaType,
    specificType,
    query,
    lang,
    page,
  );
  const data = promise.genres;
  return data;
}
