// я создала обьект он лежит сразу в папке js
import { API_KEY, URL } from './consts.js';

export const fetchApi = {
  page: 1,
  genres: '',
  query: '',
  lang: 'en',
  movieID: 1,

  async fetchData(fetchType, mediaType, specificType, ...args) {
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
  },

  async fetchDiscover() {
    const fetchType = '/discover';
    const mediaType = '/movie';
    const specificType = '';
    let lang = `&language=${fetchApi.lang}`;
    const sortBy = '';
    let page = `&page=${fetchApi.page}`;
    let genres;
    if (fetchApi.genres !== '') genres = `&with_genres=${fetchApi.genres}`;
    else genres = '';

    const promise = await fetchData(
      fetchType,
      mediaType,
      specificType,
      lang,
      page,
      genres,
      sortBy,
    );
    return promise.results;
  },

  async fetchGenre() {
    const fetchType = '/genre';
    const mediaType = '/movie';
    const specificType = '/list';
    let lang = `&language=${fetchApi.lang}`;

    const promise = await fetchApi.fetchData(
      fetchType,
      mediaType,
      specificType,
      lang,
    );
    return promise.genres;
  },

  async fetchSearch() {
    const fetchType = '/search';
    const specificType = '';
    const mediaType = '/movie';
    let lang = `&language=${fetchApi.lang}`;
    let page = `&page=${fetchApi.page}`;
    let query = `&query=${fetchApi.query}`;

    const promise = await fetchData(
      fetchType,
      mediaType,
      specificType,
      lang,
      page,
      query,
    );
    return promise.results;
  },

  async fetchTrending() {
    const fetchType = '/trending';
    const mediaType = '/movie';
    const timeWindow = '/day';
    let lang = `&language=${fetchApi.lang}`;
    let page = `&page=${fetchApi.page}`;

    const promise = await fetchData(
      fetchType,
      mediaType,
      timeWindow,
      lang,
      page,
    );
    return promise.results;
  },

  async fetchDataByID() {
    const fetchType = '';
    const mediaType = '/movie';
    const specificType = `/${fetchApi.movieID}`;
    let lang = `&language=${fetchApi.lang}`;

    const promise = await fetchData(fetchType, mediaType, specificType, lang);
    return promise;
  },
};

let {
  fetchData,
  fetchDiscover,
  fetchGenre,
  fetchSearch,
  fetchTrending,
  fetchDataByID,
} = fetchApi;

export {
  fetchData,
  fetchDiscover,
  fetchGenre,
  fetchSearch,
  fetchTrending,
  fetchDataByID,
};
