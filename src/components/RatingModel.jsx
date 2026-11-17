import React, { useState, useEffect } from 'react';

function RatingModel({ isOpen, onClose, movie, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [existingReview, setExistingReview] = useState(null);

  // Load existing review when modal opens
  useEffect(() => {
    if (isOpen && movie) {
      const reviews = JSON.parse(localStorage.getItem('movieReviews')) || {};
      const movieReview = reviews[movie.id];
      
      if (movieReview) {
        setRating(movieReview.rating);
        setReview(movieReview.review || '');
        setExistingReview(movieReview);
      } else {
        // Reset if no existing review
        setRating(0);
        setReview('');
        setExistingReview(null);
      }
    }
  }, [isOpen, movie]);

  if (!isOpen || !movie) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    onSubmit(movie.id, rating, review, movie,false);
    onClose();
  };

  const handleDelete = () => {
  if (window.confirm('Are you sure you want to delete your review?')) {
    const reviews = JSON.parse(localStorage.getItem('movieReviews')) || {};
    delete reviews[movie.id];
    localStorage.setItem('movieReviews', JSON.stringify(reviews));
    
    setRating(0);
    setReview('');
    setExistingReview(null);
    
    onSubmit(movie.id, 0, '', movie, true); // Changed: Pass 'movie' instead of 'null'
    onClose();
  }
};

  const renderStars = () => {
    return [...Array(10)].map((_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoverRating || rating);
      
      return (
        <svg
          key={index}
          className={`w-10 h-10 cursor-pointer transition-colors ${
            isFilled ? 'text-yellow-400 fill-current' : 'text-gray-400'
          }`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
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
      );
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
       
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {existingReview ? 'Edit Your Rating' : 'Rate this movie'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
            ×
          </button>
        </div>

        <h3 className="text-white text-lg mb-6 text-center">{movie.title}</h3>
        <div className="flex justify-center gap-2 mb-6">
          {renderStars()}
        </div>

        {rating > 0 && (
          <p className="text-center text-yellow-400 mb-4">
            {rating} / 10 stars
          </p>
        )}

        <div className="mb-6">
          <label className="block text-white mb-2 text-sm">
            Add a review (optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full bg-gray-700 text-white rounded p-3 min-h-25 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share your thoughts about this movie..."
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors"
          >
            { 'Submit Rating'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded font-medium transition-colors"
          >
            Cancel
          </button>
        </div>

        {existingReview && (
          <button
            onClick={handleDelete}
            className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-medium transition-colors"
          >
            Delete Review
          </button>
        )}
      </div>
    </div>
  );
}

export default RatingModel;