import React from 'react'
import { useEffect, useState } from 'react'
import CardImg from '../assets/cardimg.jpg'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Heart } from 'lucide-react';
import MovieDetailModel from './MovieDetailModel';
import RatingModel from './RatingModel';

import 'swiper/css';

function CardList({title, category, favourites = [], handleFavourite, isFavourite}) {
  const [data, setData] = useState([]);
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

  const fetchCategoryMovie = async () => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`, options)
      const datas = await res.json()

      if (datas.results && datas.results.length > 0) {
        setData(datas.results)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const loadUserReviews = () => {
    const reviews = JSON.parse(localStorage.getItem('movieReviews')) || {};
    setUserReviews(reviews);
  };

  useEffect(() => {
    fetchCategoryMovie();
    loadUserReviews();
  }, [])

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
    setIsDetailModalOpen(true);
  };

  const handleRateClick = (movie) => {
    setSelectedMovie(movie);
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
    title: movieData.title || 'Unknown',
    posterPath: movieData.poster_path || '',
    backdropPath: movieData.backdrop_path || '',
    releaseDate: movieData.release_date || '',
    date: new Date().toISOString()
    };
    
    localStorage.setItem('movieReviews', JSON.stringify(existingReviews));
    setUserReviews(existingReviews);
  };

  const toggleFavourite = (movie, e) => {
    e.stopPropagation();
    handleFavourite(movie);
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

  if (!data.length) {
    return <p className="text-white">Loading..</p>
  }

  return (
    <div className='text-white md:px-4'>
      <h2 className='pt-10 pb-5 text-lg font-medium'>{title || 'Upcoming'}</h2>
      <Swiper 
        slidesPerView="auto"
        spaceBetween={10}
        
        className="mySwiper"
      >
        {data.map((item, index) => (
          <SwiperSlide key={index} className='max-w-72'>
            <div 
              onClick={() => handleCardClick(item)}
              className="cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                  alt={item.title}
                  className="h-44 w-full object-center object-cover rounded transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded flex items-center gap-1">
                  <span className="text-yellow-400 text-sm font-bold">
                    {item.vote_average.toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-xs">/10</span>
                </div>

                <button
                  onClick={(e) => toggleFavourite(item, e)}
                  className="absolute top-2 left-2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all cursor-pointer"
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      isFavourite(item.id) 
                        ? 'text-[#e50914] fill-[#e50914]' 
                        : 'text-white'
                    }`}
                  />
                </button>
              </div>
              
              <p className="text-center pt-2 font-medium">{item.title}</p>
              
              {userReviews[item.id] && (
                <div className="mt-2">
                  {renderStars(userReviews[item.id].rating)}
                  <p className="text-center text-yellow-400 text-sm mt-1">
                    Your Rating: {userReviews[item.id].rating}/10
                  </p>
                  {userReviews[item.id].review && (
                    <p className="text-center text-gray-400 text-xs mt-1 line-clamp-2 px-2">
                      "{userReviews[item.id].review}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

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
  )
}

export default CardList