// я создала обьект он лежит сразу в папке js
import { API_KEY, URL } from './consts.js';

export const fetchApi = {
  async fetchData(fetchType, mediaType, specificType, ...args) {
    args = args.join('');
    try {
      const promise = await fetch(
        `${URL}/3${fetchType}${mediaType}${specificType}?api_key=${API_KEY}${args}`,
      );
      if (!promise.ok) throw Error(promise.statusText);
      const data = await promise.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log('error', error);
    }
  },

  async fetchDiscover(pageValue, genresValue) {
    const fetchType = '/discover';
    const mediaType = '/movie';
    const specificType = '';
    const lang = '&language=en';
    let page = `&page=${pageValue}`;
    //   genresValue = genresValue.join('|');
    let genre = `&with_genres=${genresValue}`;

    const promise = await fetchData(
      fetchType,
      mediaType,
      specificType,
      lang,
      page,
      genre,
    );
    return promise.results;
  },

  async fetchGenre() {
    const fetchType = '/genre';
    const mediaType = '/movie';
    const specificType = '/list';
    const lang = '&language=en';

    const promise = await fetchApi.fetchData(
      fetchType,
      mediaType,
      specificType,
      lang,
    );
    return promise.genres;
  },

  async fetchSearch(pageValue = 1, language = 'en', queryValue = '') {
    const fetchType = '/search';
    const specificType = '';
    const mediaType = '/movie';
    const lang = `&language=${language}`;
    let page = `&page=${pageValue}`;
    let query = `&query=${queryValue}`;

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

  async fetchTrending(pageValue = 1) {
    const fetchType = '/trending';
    const mediaType = '/movie';
    const timeWindow = '/day';
    const lang = '&language=en';
    let page = `&page=${pageValue}`;

    const promise = await fetchData(
      fetchType,
      mediaType,
      timeWindow,
      lang,
      page,
    );
    return promise.results;
  },
  //  эту нужно переделать а потом подключить  в modal.js

  async fetchDataByID(e) {
    refs.closeModalBtn.addEventListener('click', onClearHtml);
    const movieID = e.target.closest('li').id;
    console.log(movieID);
    try {
      const promise = await fetch(
        `${URL}/3/movie/${movieID}?api_key=${API_KEY}`,
      );
      if (!promise.ok) throw Error(promise.statusText);
      const data = await promise.json();
      console.log(data);
      console.log(movieCardTmpl(data));
      refs.modalContainer.innerHTML = movieCardTmpl(data);
    } catch (error) {
      console.log('Error:', error);
    }
    toggleModal();
  },
};

const {
  fetchData,
  fetchDiscover,
  fetchGenre,
  fetchSearch,
  fetchTrending,
  // fetchDataByID,
} = fetchApi;

// console.log(fetchData, fetchDiscover);
export {
  fetchData,
  fetchDiscover,
  fetchGenre,
  fetchSearch,
  fetchTrending,
  // fetchDataByID,
};

// функции fetchGenre,fetchSearch, я не много поправила так как там значения не совподали и не работало - посмотри)
