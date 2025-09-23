import React, { useState } from 'react';
import { reviewAPI } from '../api/reviewAPI';

const ReviewSubmissionForm = ({ productId, orderId, onReviewSubmitted, onClose }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a review title');
      return;
    }

    if (!formData.comment.trim()) {
      setError('Please enter a review comment');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        productId,
        orderId: orderId || null,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        images: formData.images
      };

      const response = await reviewAPI.createReview(reviewData);
      
      if (response.success) {
        onReviewSubmitted(response.review);
        onClose();
      } else {
        setError(response.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Submit review error:', error);
      setError(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingClick, size = 'text-2xl' }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingClick(star)}
            className={`${size} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating) => {
    const texts = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return texts[rating] || '';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Write a Review</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating *
            </label>
            <div className="flex items-center gap-3">
              <StarRating 
                rating={formData.rating} 
                onRatingClick={handleRatingClick}
              />
              <span className="text-sm text-gray-600">
                {getRatingText(formData.rating)}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Give your review a title"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={100}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.title.length}/100
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Comment *
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Tell others about your experience with this product"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={1000}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.comment.length}/1000
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-[#e91e63] text-white rounded-md hover:bg-[#d81b60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewSubmissionForm;