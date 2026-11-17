# 🎬 Movie Search App

A React movie search application powered by the **OMDB API**. Search for movies and series, filter by type, and page through results.

## Features

- 🔍 Search bar (navbar) for titles or keywords
- 🗂 Results grid with poster, title, year, type and a short plot
- 🎚 Type dropdown (All / Movies / TV Series / Episodes) — applied by the OMDB API via its `type` parameter, not by client-side filtering
- 🔢 Pagination (10 results per page, up to OMDB's 100-page limit)
- ⚠️ User-friendly messages for no results, invalid API key, rate limits and network errors
- ❤️ Favourites list (see "Known gaps")
- 🔗 Search state lives in the URL: `/search?query=batman&type=movie&page=2`

## Tech Stack

React 19, React Router 7, Vite, Tailwind CSS 4, lucide-react.

## Getting Started

1. Get a free key at <https://www.omdbapi.com/apikey.aspx>.
2. Copy `.env.example` to `.env` and set `VITE_OMDB_API_KEY`.
3. Install and run:

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  services/omdbApi.js     OMDB API calls: searchMovies(), getMovieDetails()
  components/SearchBar.jsx  Navbar search input
  components/Pagination.jsx Previous / numbered / Next controls
  pages/SearchResult.jsx    Results grid, type dropdown, error + empty states
```

## Known gaps

- Movie details page (`/movie/:id`) is not built yet; `getMovieDetails()` is ready for it.
- Home, TV Shows, Anime and Favourites pages still use the TMDB API.
