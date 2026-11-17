/**
 * OMDB API service layer.
 *
 * All network access to https://www.omdbapi.com/ lives here so that
 * components never build URLs or parse raw responses themselves.
 *
 * Requires a free API key: https://www.omdbapi.com/apikey.aspx
 * Put it in a `.env` file as:  VITE_OMDB_API_KEY=your_key
 */

const BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

/** OMDB returns 10 results per page. */
export const PAGE_SIZE = 10;

/** OMDB never serves more than 100 pages for a single search. */
export const MAX_PAGES = 100;

/** Values accepted by OMDB's `type` parameter (used by the dropdown filter). */
export const MEDIA_TYPES = [
  { value: '', label: 'All types' },
  { value: 'movie', label: 'Movies' },
  { value: 'series', label: 'TV Series' },
  { value: 'episode', label: 'Episodes' },
];

/** Error with a message that is safe to show directly to the user. */
export class OmdbError extends Error {}

/** Translate OMDB's raw error strings into friendlier messages. */
function friendlyMessage(apiError) {
  switch (apiError) {
    case 'Too many results.':
      return 'Too many results. Please type a longer or more specific title.';
    case 'Invalid API key!':
      return 'The OMDB API key is invalid. Check VITE_OMDB_API_KEY in your .env file.';
    case 'Request limit reached!':
      return 'The daily OMDB request limit has been reached. Please try again tomorrow.';
    default:
      return apiError || 'Something went wrong while contacting OMDB.';
  }
}

/**
 * Perform a GET request against OMDB and return the parsed JSON.
 * Throws OmdbError for network problems, HTTP errors and `Response: "False"`.
 */
async function request(params) {
  if (!API_KEY) {
    throw new OmdbError(
      'Missing OMDB API key. Add VITE_OMDB_API_KEY to your .env file and restart the dev server.'
    );
  }

  const url = new URL(BASE_URL);
  url.search = new URLSearchParams({ apikey: API_KEY, ...params }).toString();

  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new OmdbError('Network error. Please check your internet connection and try again.');
  }

  if (!response.ok) {
    throw new OmdbError(`OMDB responded with an error (HTTP ${response.status}). Please try again.`);
  }

  const data = await response.json();
  if (data.Response === 'False') {
    // Keep the raw message on the error so callers can detect "not found".
    const error = new OmdbError(friendlyMessage(data.Error));
    error.apiError = data.Error;
    throw error;
  }
  return data;
}

/**
 * Search OMDB by title/keyword.
 *
 * The type filter is applied by OMDB itself (`type` query parameter),
 * not by filtering the results on the client.
 *
 * @param {object} options
 * @param {string} options.query  Title or keyword.
 * @param {string} [options.type] '', 'movie', 'series' or 'episode'.
 * @param {number} [options.page] 1-based page number.
 * @returns {Promise<{movies: object[], totalResults: number}>}
 *          An empty list (not an error) when nothing matches.
 */
export async function searchMovies({ query, type = '', page = 1 }) {
  const params = { s: query, page: String(page) };
  if (type) params.type = type;

  try {
    const data = await request(params);
    return { movies: data.Search, totalResults: Number(data.totalResults) || 0 };
  } catch (error) {
    if (error.apiError === 'Movie not found!') {
      return { movies: [], totalResults: 0 };
    }
    throw error;
  }
}

/**
 * Fetch full details (poster, genre, plot, ratings, cast...) for one title.
 *
 * @param {string} imdbID  e.g. "tt0133093".
 * @param {'short'|'full'} [plot]
 */
export function getMovieDetails(imdbID, plot = 'short') {
  return request({ i: imdbID, plot });
}
