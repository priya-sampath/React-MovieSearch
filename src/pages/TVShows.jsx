import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import MovieDetailModel from '../components/MovieDetailModel';
import RatingModel from '../components/RatingModel';

function TVShows({ favourites = [], handleFavourite, isFavourite }) {
  const [tvShows, setTvShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userReviews, setUserReviews] = useState({});

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNGVlNzYyMDRhNjIxYWZhMzg1NTgyYzFhN2I2MWRiNyIsIm5iZiI6MTc2ODMwODA5OS4zNTgsInN1YiI6IjY5NjYzZDgzMzczNDhjMGNkZTJlZGQxYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.czVrerqakS1846NMI5JfV9sLsuLHnAXFsh1bvEO5lAU'
    }
  };

  const fetchTVShows = async (page) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${page}`,
        options
      );
      const data = await res.json();
      
      if (data.results) {
        setTvShows(data.results);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
      }
    } catch (err) {
      console.error('Error fetching TV shows:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserReviews = () => {
    const reviews = JSON.parse(localStorage.getItem('movieReviews')) || {};
    setUserReviews(reviews);
  };

  useEffect(() => {
    fetchTVShows(currentPage);
    loadUserReviews();
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleCardClick = (show) => {
    const movieFormat = {
      ...show,
      title: show.name,
      release_date: show.first_air_date
    };
    setSelectedMovie(movieFormat);
    setIsDetailModalOpen(true);
  };

  const handleRateClick = (show) => {
    const movieFormat = {
      ...show,
      title: show.name,
      release_date: show.first_air_date
    };
    setSelectedMovie(movieFormat);
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = (movieId, userRating, review, movieData, isDelete = false) => {
    if (isDelete) {
      loadUserReviews();
      return;
    }
    
    const existingReviews = JSON.parse(localStorage.getItem('movieReviews')) || {};
    existingReviews[movieId] = {
      rating: userRating,
      review: review,
      tmdbRating: movieData.vote_average || 0,
      voteCount: movieData.vote_count || 0,
      title: movieData.title || movieData.name || 'Unknown',
      posterPath: movieData.poster_path || '',
      backdropPath: movieData.backdrop_path || '',
      releaseDate: movieData.release_date || movieData.first_air_date || '',
      date: new Date().toISOString()
    };
    
    localStorage.setItem('movieReviews', JSON.stringify(existingReviews));
    setUserReviews(existingReviews);
  };

  const toggleFavourite = (show, e) => {
    e.stopPropagation();
    handleFavourite(show);
  };

  const renderStars = (rating, maxStars = 10) => {
    const filledStars = Math.round(rating);
    return (
      <div className="flex gap-0.5 justify-center">
        {[...Array(maxStars)].map((_, index) => (
          <svg
            key={index}
            className={`w-3 h-3 ${
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

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 md:px-8 py-8 max-w-screen mx-auto">
      <h1 className="text-3xl font-bold mb-8">Popular TV Shows</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            {tvShows.map((show) => (
              <div 
                key={show.id} 
                className="cursor-pointer group w-50"
                onClick={() => handleCardClick(show)}
              >
                <div className="relative w-50">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    className="w-full h-auto rounded-lg transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded flex items-center gap-1">
                    <span className="text-yellow-400 text-sm font-bold">
                      {show.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => toggleFavourite(show, e)}
                    className="absolute top-2 left-2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all cursor-pointer"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        isFavourite(show.id) 
                          ? 'text-[#e50914] fill-[#e50914]' 
                          : 'text-white'
                      }`}
                    />
                  </button>
                </div>
                <h3 className="mt-2 text-sm font-medium text-center line-clamp-2">
                  {show.name}
                </h3>
                <p className="text-xs text-gray-400 text-center">
                  {show.first_air_date?.split('-')[0]}
                </p>
                {userReviews[show.id] && (
                  <div className="mt-2">
                    {renderStars(userReviews[show.id].rating)}
                    <p className="text-center text-yellow-400 text-sm mt-1">
                      Your Rating: {userReviews[show.id].rating}/10
                    </p>
                    {userReviews[show.id].review && (
                      <p className="text-center text-gray-400 text-xs mt-1 line-clamp-2 px-2">
                        "{userReviews[show.id].review}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-[#e50914] hover:bg-[#b20710] text-white cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-[#e50914] hover:bg-[#b20710] text-white cursor-pointer'
              }`}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}

      <MovieDetailModel
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        movie={selectedMovie}
        onRateClick={handleRateClick}
        favourites={favourites}
        handleFavourite={handleFavourite}
        isFavourite={isFavourite}
      />

      <RatingModel
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        movie={selectedMovie}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}

export default TVShows;