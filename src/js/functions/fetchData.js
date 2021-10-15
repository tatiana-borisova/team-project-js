import { API_KEY, URL } from '../consts.js';

export default async function fetchData(
  fetchType,
  mediaType,
  specificType,
  ...args
) {
  args = args.join('');
  try {
    const promise = await fetch(
      `${URL}/3${fetchType}${mediaType}${specificType}?api_key=${API_KEY}${args}`,
    );
    if (!promise.ok) throw Error(promise.statusText);
    const data = await promise.json();
    return data;
  } catch (error) {
    console.log('error', error);
  }
}
