import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { AlertCircle, Film, Search } from 'lucide-react';
import Pagination from '../components/Pagination';
import {
  searchMovies,
  getMovieDetails,
  MEDIA_TYPES,
  PAGE_SIZE,
  MAX_PAGES,
} from '../services/omdbApi';

/**
 * Search results page (`/search?query=...&type=...&page=...`).
 *
 * The URL is the single source of truth for query, type and page, so
 * results are shareable and the browser back button works.
 */
function SearchResult() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get('query') || '').trim();
  const type = searchParams.get('type') || '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [movies, setMovies] = useState([]);
  const [plots, setPlots] = useState({}); // imdbID -> short plot
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch results whenever query / type / page change.
  useEffect(() => {
    if (!query) {
      setMovies([]);
      setTotalResults(0);
      setError('');
      return;
    }

    let cancelled = false; // ignore stale responses if the params change quickly

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await searchMovies({ query, type, page });
        if (cancelled) return;
        setMovies(result.movies);
        setTotalResults(result.totalResults);
        setPlots({});
        window.scrollTo(0, 0);

        // Search results have no description, so fetch a short plot for each
        // card. A failure here is non-fatal: the card just has no description.
        const details = await Promise.allSettled(
          result.movies.map((m) => getMovieDetails(m.imdbID, 'short'))
        );
        if (cancelled) return;
        const nextPlots = {};
        details.forEach((d, i) => {
          if (d.status === 'fulfilled' && d.value.Plot && d.value.Plot !== 'N/A') {
            nextPlots[result.movies[i].imdbID] = d.value.Plot;
          }
        });
        setPlots(nextPlots);
      } catch (err) {
        if (cancelled) return;
        setMovies([]);
        setTotalResults(0);
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [query, type, page]);

  /** Merge changes into the URL params, e.g. updateParams({ page: 2 }). */
  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === '' || value == null) next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next);
  };

  const handleTypeChange = (e) => updateParams({ type: e.target.value, page: 1 });

  const totalPages = Math.min(Math.ceil(totalResults / PAGE_SIZE), MAX_PAGES);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 md:px-8 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          {query && (
            <p className="text-gray-400">
              Showing results for: <span className="text-white font-semibold">"{query}"</span>
              {!loading && !error && totalResults > 0 && ` (${totalResults.toLocaleString()} found)`}
            </p>
          )}
        </div>

        {/* Type filter: sent to OMDB as the `type` parameter. */}
        <label className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Type</span>
          <select
            value={type}
            onChange={handleTypeChange}
            className="bg-[#333333] px-3 py-2 rounded outline-none focus:ring-2 focus:ring-[#e50914] cursor-pointer"
          >
            {MEDIA_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!query ? (
        <Message icon={Search} title="Search for a movie or series" text="Type a title or keyword in the search bar above." />
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Searching...</p>
        </div>
      ) : error ? (
        <Message icon={AlertCircle} title="Couldn't load results" text={error} />
      ) : movies.length === 0 ? (
        <Message
          icon={Film}
          title={`No results found for "${query}"`}
          text="Check the spelling, try a different keyword, or change the type filter."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <article key={movie.imdbID} className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
                {movie.Poster && movie.Poster !== 'N/A' ? (
                  <img src={movie.Poster} alt={`${movie.Title} poster`} className="w-full aspect-2/3 object-cover" />
                ) : (
                  <div className="w-full aspect-2/3 bg-gray-700 flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </div>
                )}
                <div className="p-3 flex flex-col gap-1 flex-1">
                  <h3 className="font-semibold line-clamp-2">{movie.Title}</h3>
                  <p className="text-xs text-gray-400">
                    {movie.Year} · <span className="uppercase">{movie.Type}</span>
                  </p>
                  {plots[movie.imdbID] && (
                    <p className="text-xs text-gray-300 line-clamp-4 mt-1">{plots[movie.imdbID]}</p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => updateParams({ page: p })}
          />
        </>
      )}
    </div>
  );
}

/** Centered icon + title + text used for empty and error states. */
function Message({ icon: Icon, title, text }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center px-4">
      <Icon className="w-12 h-12 text-gray-600 mb-4" />
      <p className="text-xl text-gray-300 mb-2">{title}</p>
      <p className="text-gray-500 max-w-md">{text}</p>
    </div>
  );
}

export default SearchResult;
