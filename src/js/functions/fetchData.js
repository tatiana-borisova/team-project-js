import { API_KEY, URL } from '../consts.js';

export default async function fetchData(
  fetchType,
  mediaType,
  specificType,
  query,
  lang,
  page,
  genre,
) {
  try {
    const promise = await fetch(
      `${URL}/3${fetchType}${mediaType}${specificType}?api_key=${API_KEY}${query}&language=${lang}&page=${page}${genre}`,
    );
    if (!promise.ok) throw Error(promise.statusText);
    const data = await promise.json();
    return data;
  } catch (error) {
    console.log('error', error);
  }
}
