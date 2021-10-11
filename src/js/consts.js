const API_KEY = 'f205ff9551fdba7fe2c499379d3dfbc2';
const URL = 'https://api.themoviedb.org';

// export { API_KEY, URL };

export async function getPopularFilms() {
   try {
      const response = await fetch(`${URL}/3/trending/all/day?api_key=${API_KEY}`);
      return await response.json();
   }
   catch (error) {
      console.error(error);
   }
}

export async function getGenreList() {
  try {
      const response = await fetch(`${URL}/3/genre/movie/list?api_key=${API_KEY}`);
      const data = await response.json()
      return data.genres
   }
   catch (error) {
      console.error(error);
  }
}

// https://api.themoviedb.org/3/movie/505?api_key=f205ff9551fdba7fe2c499379d3dfbc2

// https://api.themoviedb.org/3/trending/all/day?api_key=<<api_key>>