import React, { useState, useEffect } from 'react'
import { ArrowLeft, Trash2, Heart } from 'lucide-react'
import { useNavigate } from 'react-router'

function Favourite({ favourites = [], removeFavourite }) {
  const navigate = useNavigate()
  const [userReviews, setUserReviews] = useState({})

  useEffect(() => {
    loadUserReviews()
  }, [])

  const loadUserReviews = () => {
    const reviews = JSON.parse(localStorage.getItem('movieReviews')) || {}
    setUserReviews(reviews)
  }

  const handleDelete = (movie) => {
    const confirmDelete = window.confirm(
      'Remove this movie from favourites?'
    )

    if (confirmDelete) {
      removeFavourite(movie.id)
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 md:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 mb-6 text-gray-300 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-[#e50914]" fill="#e50914" />
        <h1 className="text-3xl font-bold">My Favourites</h1>
        <span className="text-gray-400 text-lg">
          ({favourites.length})
        </span>
      </div>

      {favourites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Heart className="w-16 h-16 text-gray-600 mb-4" />
          <p className="text-xl text-gray-400 mb-2">No favourites yet</p>
          <p className="text-gray-500 mb-6">
            Start adding movies you love!
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-[#e50914] hover:bg-[#b20710] rounded transition-colors cursor-pointer"
          >
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {favourites.map((movie) => (
            <div 
              key={movie.id} 
              className="group relative w-50"
            >
              <button
                onClick={() => handleDelete(movie)}
                className="absolute -top-2 -right-2 z-10 bg-red-600 hover:bg-red-700 rounded-full p-2
                           opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>

              <div className="cursor-pointer">
                <div className="relative">
                  <img
                    src={
                      movie.posterPath
                        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                        : movie.backdropPath
                        ? `https://image.tmdb.org/t/p/w500${movie.backdropPath}`
                        : 'https://via.placeholder.com/500x750?text=No+Image'
                    }
                    alt={movie.title}
                    className="w-full h-auto rounded-lg transition-transform group-hover:scale-105"
                  />

                  {movie.tmdbRating && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded flex items-center gap-1">
                      <span className="text-yellow-400 text-sm font-bold">
                        {movie.tmdbRating.toFixed(1)}
                      </span>
                      <span className="text-gray-400 text-xs">/10</span>
                    </div>
                  )}

                  <div className="absolute top-2 left-2 bg-[#e50914] bg-opacity-90 p-1.5 rounded-full">
                    <Heart className="w-4 h-4 text-white" fill="white" />
                  </div>
                </div>

                <h3 className="mt-2 text-sm font-medium text-center line-clamp-2">
                  {movie.title}
                </h3>

                {movie.releaseDate && (
                  <p className="text-xs text-gray-400 text-center">
                    {movie.releaseDate.split('-')[0]}
                  </p>
                )}

                {userReviews[movie.id] && (
                  <div className="mt-2">
                    {renderStars(userReviews[movie.id].rating)}
                    <p className="text-center text-yellow-400 text-sm mt-1">
                      Your Rating: {userReviews[movie.id].rating}/10
                    </p>
                    {userReviews[movie.id].review && (
                      <p className="text-center text-gray-400 text-xs mt-1 line-clamp-2 px-2">
                        "{userReviews[movie.id].review}"
                      </p>
                    )}
                  </div>
                )}

                {movie.addedDate && (
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Added {new Date(movie.addedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favourite