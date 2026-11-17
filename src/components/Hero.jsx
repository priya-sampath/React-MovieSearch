import React, { useEffect, useState } from 'react'
import Herobg from '../assets/hero.jpg'
import { Play, Bookmark, BookmarkCheck } from 'lucide-react'

function Hero({ favourites = [], handleFavourite = () => {}, isFavourite = () => false }) {
  const [movie, setMovie] = useState(null);
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNGVlNzYyMDRhNjIxYWZhMzg1NTgyYzFhN2I2MWRiNyIsIm5iZiI6MTc2ODMwODA5OS4zNTgsInN1YiI6IjY5NjYzZDgzMzczNDhjMGNkZTJlZGQxYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.czVrerqakS1846NMI5JfV9sLsuLHnAXFsh1bvEO5lAU'
    }
  };

  const fetchMovie = async () => {
    try {
      const res = await fetch(
        'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1',
        options
      )

      const data = await res.json()

      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length)
        const selectedMovie = data.results[randomIndex]
        setMovie(selectedMovie)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveForLater = () => {
    if (!movie) return;
    handleFavourite(movie);
  }

  useEffect(() => {
    fetchMovie();
  }, [])

  if (!movie) {
    return <p className="text-white">Loading....</p>
  }

  const isInFavourites = typeof isFavourite === 'function' ? isFavourite(movie.id) : false;

  return (
    <div className='text-white relative'>
      <img 
        src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} 
        alt="bg-img" 
        className='w-full rounded-2xl h-120 object-center object-cover' 
      />
      <div className='flex space-x-2 md:space-x-4 absolute xl:bottom-2 left-12 md:bottom-8 bottom-3 font-medium'>
        <button 
          onClick={handleSaveForLater}
          className={`flex justify-center items-center hover:bg-opacity-90 py-3 px-4 cursor-pointer text-small md:text-base rounded-full transition-all ${
            isInFavourites 
              ? 'bg-green-600 text-white' 
              : 'bg-[#e50914] text-white hover:bg-gray-200'
          }`}
        >
          {isInFavourites ? (
            <>
              <BookmarkCheck className='w-4 h-5 mr-2' />
              Saved
            </>
          ) : (
            <>
              <Bookmark className='w-4 h-5 mr-2' />
              Save for Later
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default Hero