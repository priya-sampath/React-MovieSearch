import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

function MovieDetailModel({ isOpen, onClose, movie, onRateClick, favourites = [], handleFavourite, isFavourite }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNGVlNzYyMDRhNjIxYWZhMzg1NTgyYzFhN2I2MWRiNyIsIm5iZiI6MTc2ODMwODA5OS4zNTgsInN1YiI6IjY5NjYzZDgzMzczNDhjMGNkZTJlZGQxYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.czVrerqakS1846NMI5JfV9sLsuLHnAXFsh1bvEO5lAU'
    }
  };

  useEffect(() => {
    if (isOpen && movie) {
      fetchMovieDetails();
    }
  }, [isOpen, movie]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?append_to_response=credits`,
        options
      );
      const data = await response.json();
      setMovieDetails(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavourite = () => {
    if (!movie) return;
    handleFavourite(movie);
  };

  if (!isOpen || !movie) return null;

  const handleRateClick = () => {
    onClose();
    onRateClick(movie);
  };

  const isInFavourites = isFavourite(movie.id);

  const renderStars = (rating) => {
    const filledStars = Math.round(rating);
    return (
      <div className="flex gap-0.5">
        {[...Array(10)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < filledStars ? 'text-yellow-400 fill-current' : 'text-gray-500'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-lg max-w-4xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="p-8 text-white text-center">Loading...</div>
        ) : (
          <>
            <div className="relative h-36">
              
            </div>

            <div className="p-6 -mt-32 relative z-10">
              <div className="flex gap-6">
                <div className="shrink-0 hidden md:block">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-48 rounded-lg shadow-lg"
                  />
                </div>

                <div className="flex-1 text-white">
                  <h2 className="text-4xl font-bold mb-2">{movie.title}</h2>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-gray-400">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                    <div className="flex items-center gap-2">
                      {renderStars(movie.vote_average)}
                      <span className="text-yellow-400 font-bold">
                        {/* {movie.vote_average.toFixed(1)}/10 */}
                        {movie?.vote_average != null
                          ? `${parseFloat(movie.vote_average).toFixed(1)}/10`
                          : 'N/A'}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {/* ({movie.vote_count.toLocaleString()} votes) */}
                        {movie?.vote_count != null
                        ? `(${parseInt(movie.vote_count).toLocaleString()} votes)`
                        : '(0 votes)'}
                      </span>
                    </div>
                  </div>

                  {movieDetails?.genres && (
                    <div className="flex gap-2 mb-4">
                      {movieDetails.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Overview</h3>
                    <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                  </div>

                  {movieDetails && (
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div>
                        <span className="text-gray-400">Runtime:</span>
                        <span className="ml-2 text-white">
                          {movieDetails.runtime} minutes
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Language:</span>
                        <span className="ml-2 text-white uppercase">
                          {movie.original_language}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Release Date:</span>
                        <span className="ml-2 text-white">
                          {new Date(movie.release_date).toLocaleDateString()}
                        </span>
                      </div>
                      {movieDetails.budget > 0 && (
                        <div>
                          <span className="text-gray-400">Budget:</span>
                          <span className="ml-2 text-white">
                            ${(movieDetails.budget / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {movieDetails?.credits?.cast && movieDetails.credits.cast.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3">Cast</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {movieDetails.credits.cast.slice(0, 8).map((actor) => (
                          <div key={actor.id} className="flex items-center gap-2">
                            {actor.profile_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                alt={actor.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">
                                  {actor.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{actor.name}</p>
                              <p className="text-xs text-gray-400 truncate">
                                {actor.character}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleRateClick}
                      className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      Rate This Movie
                    </button>
                    <button
                      onClick={toggleFavourite}
                      className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                        isInFavourites
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isInFavourites ? 'fill-white' : ''}`} />
                      {isInFavourites ? 'Already in Favourites' : 'Save for Later'}
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 md:flex-none px-6 py-3 bg-orange-600 hover:bg-orange-800 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MovieDetailModel;