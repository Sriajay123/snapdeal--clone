import api from './api.js';

// Review API functions
export const reviewAPI = {
  // Create a new review
  createReview: async (reviewData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/reviews', reviewData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create review' };
    }
  },

  // Get reviews for a product
  getProductReviews: async (productId, params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/reviews/product/${productId}?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch reviews' };
    }
  },

  // Get current user's reviews
  getUserReviews: async (params = {}) => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/reviews/user?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user reviews' };
    }
  },

  // Check if user can review a product
  canReviewProduct: async (productId, orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/reviews/can-review/${productId}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check review eligibility' };
    }
  },

  // Mark review as helpful
  markReviewHelpful: async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.patch(`/reviews/${reviewId}/helpful`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update review' };
    }
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(`/reviews/${reviewId}`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update review' };
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(`/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete review' };
    }
  }
};

export default reviewAPI;