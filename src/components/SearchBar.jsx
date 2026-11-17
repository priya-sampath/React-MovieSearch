import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { searchMovies } from '../services/omdbApi';

/** Wait this long after the last keystroke before calling the API. */
const DEBOUNCE_MS = 400;
/** OMDB rejects very short queries ("Too many results"), so wait for 3+ chars. */
const MIN_CHARS = 3;
/** Max suggestions shown in the dropdown. */
const MAX_SUGGESTIONS = 6;

/**
 * Navbar search input with autocomplete suggestions.
 *
 * - Typing (debounced) fetches matching titles and shows them in a dropdown.
 * - Arrow Up/Down moves through suggestions, Enter picks one, Esc closes.
 * - Submitting the form (or picking a suggestion) navigates to
 *   `/search?query=...&page=1`, keeping the current `type` filter.
 * - The input mirrors the `query` URL param so back/forward stays in sync.
 */
function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('query') || '';

  const [value, setValue] = useState(urlQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // -1 = nothing highlighted
  const wrapperRef = useRef(null);
  const skipNextFetch = useRef(false); // true right after a search is submitted

  // Keep the input in sync when the URL changes (back button, links, etc.).
  useEffect(() => {
    skipNextFetch.current = true;
    setValue(urlQuery);
  }, [urlQuery]);

  // Debounced suggestion fetch.
  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    const term = value.trim();
    if (term.length < MIN_CHARS) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const { movies } = await searchMovies({ query: term, page: 1 });
        if (cancelled) return;
        setSuggestions(movies.slice(0, MAX_SUGGESTIONS));
        setActiveIndex(-1);
        setOpen(true);
      } catch {
        // Suggestions are optional: stay quiet on errors. The results page
        // shows proper error messages when the user actually searches.
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, DEBOUNCE_MS);

    // Cleanup cancels the timer and ignores any in-flight response.
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value]);

  // Close the dropdown when clicking outside the search box.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /** Navigate to the results page for `term`. */
  const runSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    const params = new URLSearchParams({ query: trimmed, page: '1' });
    const type = searchParams.get('type');
    if (type) params.set('type', type);

    skipNextFetch.current = true; // don't re-open suggestions for this value
    setValue(trimmed);
    setOpen(false);
    setSuggestions([]);
    navigate(`/search?${params.toString()}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // If a suggestion is highlighted, search for it; otherwise use the typed text.
    if (open && activeIndex >= 0 && suggestions[activeIndex]) {
      runSearch(suggestions[activeIndex].Title);
    } else {
      runSearch(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (!open || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    }
  };

  const handleClear = () => {
    setValue('');
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <form onSubmit={handleSubmit} role="search" className="inline-flex relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          aria-label="Search movies by title or keyword"
          aria-autocomplete="list"
          aria-expanded={open}
          autoComplete="off"
          className="bg-[#333333] pl-4 pr-16 py-2 rounded-full min-w-72 outline-none focus:ring-2 focus:ring-[#e50914]"
          placeholder="Search movies, series..."
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute top-2 right-10 cursor-pointer text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <button type="submit" aria-label="Search">
          <SearchIcon className="absolute top-2 right-4 w-5 h-5 cursor-pointer" />
        </button>
      </form>

      {/* Suggestions dropdown */}
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 bg-[#1f1f1f] border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50"
        >
          {loading && suggestions.length === 0 && (
            <li className="px-4 py-3 text-gray-400">Searching...</li>
          )}

          {!loading && suggestions.length === 0 && (
            <li className="px-4 py-3 text-gray-400">No suggestions found</li>
          )}

          {suggestions.map((movie, index) => (
            <li
              key={movie.imdbID}
              role="option"
              aria-selected={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              // mousedown (not click) so it fires before the input loses focus
              onMouseDown={(e) => {
                e.preventDefault();
                runSearch(movie.Title);
              }}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
                index === activeIndex ? 'bg-[#333333]' : ''
              }`}
            >
              {movie.Poster && movie.Poster !== 'N/A' ? (
                <img src={movie.Poster} alt="" className="w-8 h-12 object-cover rounded shrink-0" />
              ) : (
                <div className="w-8 h-12 bg-gray-700 rounded shrink-0" />
              )}
              <div className="min-w-0">
                <p className="truncate text-white">{movie.Title}</p>
                <p className="text-xs text-gray-400 uppercase">
                  {movie.Year} · {movie.Type}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
