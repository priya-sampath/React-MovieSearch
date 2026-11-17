import React from 'react'
import Hero from '../components/Hero'
import CardList from '../components/CardList'
import Footer from '../components/Footer'

function Homepage({ favourites, handleFavourite, isFavourite }) {
  return (
    <div className='p-5'>
      <Hero 
        favourites={favourites}
        handleFavourite={handleFavourite}
        isFavourite={isFavourite}
      />
      <CardList 
        title="Now Playing" 
        category="now_playing"
        favourites={favourites}
        handleFavourite={handleFavourite}
        isFavourite={isFavourite}
      />
      <CardList 
        title="Top Rated" 
        category="top_rated"
        favourites={favourites}
        handleFavourite={handleFavourite}
        isFavourite={isFavourite}
      />
      <CardList 
        title="Popular" 
        category="popular"
        favourites={favourites}
        handleFavourite={handleFavourite}
        isFavourite={isFavourite}
      />
      <Footer/>
    </div>
  )
}

export default Homepage