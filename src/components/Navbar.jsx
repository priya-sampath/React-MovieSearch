import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router';
import SearchBar from './SearchBar';
import Logo from '../assets/logo.png';

function Navbar({ favouriteCount = 0 }) {
  return (
    <nav className='bg-black text-gray-200 flex justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap sticky top-0 z-50'>
      <Link to="/">
        <img src={Logo} alt='Logo' className='w-24 brightness-125 cursor-pointer' />
      </Link>
      
      <ul className='flex space-x-6 cursor-pointer'>
        <li className='hover:text-[#e50914]'>
          <Link to="/">Home</Link>
        </li>
        <li className='hover:text-[#e50914]'>
          <Link to="/tv-shows">TV Shows</Link>
        </li>
        <li className='hover:text-[#e50914]'>
          <Link to="/anime">Anime</Link>
        </li>
      </ul>
      
      <div className='flex items-center space-x-4 relative'>
        <SearchBar />
        
        <Link to="/favourites" className='relative'>
          <button className='bg-transparent cursor-pointer'>
            <Heart className='text-[#e50914]' fill='#e50914' />
          </button>
          {favouriteCount > 0 && (
            <span className='absolute -top-2 -right-2 bg-[#e50914] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
              {favouriteCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;