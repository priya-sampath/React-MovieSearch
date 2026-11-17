import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import TVShows from './pages/TVShows';
import Anime from './pages/Anime';
import SearchResult from './pages/SearchResult';
import Favourite from './pages/Favourite';

function App() {
  const [favourites, setFavourites] = useState([]);

  const handleFavourite = (movie) => {
    const existingIndex = favourites.findIndex(fav => fav.id === movie.id);
    
    if (existingIndex !== -1) {
      alert('This movie is already in your favorites!');
      return;
    }
    
    const newFavourite = {
      id: movie.id,
      title: movie.title || movie.name,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      tmdbRating: movie.vote_average,
      voteCount: movie.vote_count,
      releaseDate: movie.release_date || movie.first_air_date,
      overview: movie.overview,
      addedDate: new Date().toISOString()
    };
    
    setFavourites([...favourites, newFavourite]);
  };

  // Builds a new list without the removed movie (loop instead of Array.filter).
  const removeFavourite = (movieId) => {
    const remaining = [];
    for (const fav of favourites) {
      if (fav.id !== movieId) remaining.push(fav);
    }
    setFavourites(remaining);
  };

  const isFavourite = (movieId) => {
    return favourites.some(fav => fav.id === movieId);
  };

  return (
    <Router>
      <Navbar favouriteCount={favourites.length} 
              favourites={favourites}
              handleFavourite={handleFavourite}
              isFavourite={isFavourite} />
      <Routes>
        <Route 
          path="/" 
          element={
            <Homepage 
              favourites={favourites}
              handleFavourite={handleFavourite}
              isFavourite={isFavourite}
            />
          } 
        />
        <Route 
          path="/tv-shows" 
          element={
            <TVShows 
              favourites={favourites}
              handleFavourite={handleFavourite}
              isFavourite={isFavourite}
            />
          } 
        />
        <Route 
          path="/anime" 
          element={
            <Anime 
              favourites={favourites}
              handleFavourite={handleFavourite}
              isFavourite={isFavourite}
            />
          } 
        />
        <Route 
          path="/search" 
          element={
            <SearchResult />
          } 
        />
        <Route 
          path="/favourites" 
          element={
            <Favourite 
              favourites={favourites}
              removeFavourite={removeFavourite}
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;