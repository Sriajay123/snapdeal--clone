import express from 'express';
import {
  createReview,
  getProductReviews,
  getUserReviews,
  markReviewHelpful,
  updateReview,
  deleteReview,
  canReviewProduct
} from '../controllers/reviewController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Review routes working' });
});

// Create a new review (requires authentication)
router.post('/', authenticateToken, createReview);

// Get reviews for a specific product (public)
router.get('/product/:productId', getProductReviews);

// Get current user's reviews (requires authentication)
router.get('/user', authenticateToken, getUserReviews);

// Check if user can review a product for a specific order (requires authentication)
router.get('/can-review/:productId/:orderId', authenticateToken, canReviewProduct);

// Mark review as helpful/unhelpful (requires authentication)
router.patch('/:reviewId/helpful', authenticateToken, markReviewHelpful);

// Update a review (requires authentication)
router.put('/:reviewId', authenticateToken, updateReview);

// Delete a review (requires authentication)
router.delete('/:reviewId', authenticateToken, deleteReview);

export default router;