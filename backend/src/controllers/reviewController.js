import Review from '../models/reviewSchema.js';
import Product from '../models/productSchema.js';
import Order from '../models/orderSchema.js';
import User from '../models/userSchema.js';
import mongoose from 'mongoose';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, title, comment, images } = req.body;
    const userId = req.user._id; // Assuming you have authentication middleware

    // Validate required fields
    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, rating, title and comment are required'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // If orderId is provided, verify the order and purchase
    if (orderId) {
      // Check if order exists and belongs to the user
      const order = await Order.findOne({
        _id: orderId,
        'customerInfo.email': req.user.email // Verify order belongs to user
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or does not belong to you'
        });
      }

      // Check if the product was in this order
      const orderItem = order.items.find(item => 
        item.product.toString() === productId.toString()
      );

      if (!orderItem) {
        return res.status(400).json({
          success: false,
          message: 'Product not found in this order'
        });
      }

      // Check if order is delivered
      if (order.orderStatus !== 'delivered') {
        return res.status(400).json({
          success: false,
          message: 'You can only review products after delivery'
        });
      }

      // Check if user already reviewed this product for this order
      const existingReview = await Review.findOne({
        user: userId,
        product: productId,
        order: orderId
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this product for this order'
        });
      }
    } else {
      // For reviews without order verification, check if user already reviewed this product
      const existingReview = await Review.findOne({
        user: userId,
        product: productId
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this product'
        });
      }
    }

    // Create the review
    const review = new Review({
      user: userId,
      product: productId,
      order: orderId || null,
      rating,
      title,
      comment,
      images: images || [],
      isVerifiedPurchase: !!orderId // True if order provided, false otherwise
    });

    await review.save();

    // Update product rating and review count
    await updateProductRating(productId);

    // Populate user data for response
    await review.populate('user', 'name');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// Get reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', rating } = req.query;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    // Build filter
    const filter = {
      product: productId,
      isApproved: true
    };

    if (rating) {
      filter.rating = parseInt(rating);
    }

    // Get reviews with pagination
    const reviews = await Review.find(filter)
      .populate('user', 'name')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalReviews = await Review.countDocuments(filter);

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId), isApproved: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get average rating
    const avgRating = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId), isApproved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNext: page * limit < totalReviews,
        hasPrev: page > 1
      },
      stats: {
        averageRating: avgRating[0]?.averageRating || 0,
        totalReviews: avgRating[0]?.totalReviews || 0,
        ratingDistribution
      }
    });

  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ user: userId })
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalReviews = await Review.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews
      }
    });

  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user reviews',
      error: error.message
    });
  }
};

// Mark review as helpful
export const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already marked this helpful
    const alreadyMarked = review.usersWhoFoundHelpful.includes(userId);

    if (alreadyMarked) {
      // Remove helpful vote
      review.usersWhoFoundHelpful.pull(userId);
      review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
    } else {
      // Add helpful vote
      review.usersWhoFoundHelpful.push(userId);
      review.helpfulVotes += 1;
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: alreadyMarked ? 'Helpful vote removed' : 'Marked as helpful',
      helpfulVotes: review.helpfulVotes,
      isHelpful: !alreadyMarked
    });

  } catch (error) {
    console.error('Mark review helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user._id;

    const review = await Review.findOne({
      _id: reviewId,
      user: userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to update it'
      });
    }

    // Update fields if provided
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }
      review.rating = rating;
    }

    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;
    if (images !== undefined) review.images = images;

    await review.save();

    // Update product rating if rating changed
    if (rating !== undefined) {
      await updateProductRating(review.product);
    }

    await review.populate('user', 'name');

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findOne({
      _id: reviewId,
      user: userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to delete it'
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(reviewId);

    // Update product rating
    await updateProductRating(productId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

// Check if user can review a product
export const canReviewProduct = async (req, res) => {
  try {
    const { productId, orderId } = req.params;
    const userId = req.user._id;

    // Check if order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      'customerInfo.email': req.user.email,
      orderStatus: 'delivered'
    });

    if (!order) {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: 'Order not found, not delivered, or does not belong to you'
      });
    }

    // Check if product was in the order
    const orderItem = order.items.find(item => 
      item.product.toString() === productId.toString()
    );

    if (!orderItem) {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: 'Product not found in this order'
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
      order: orderId
    });

    if (existingReview) {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: 'Already reviewed',
        existingReview
      });
    }

    res.status(200).json({
      success: true,
      canReview: true,
      orderDetails: {
        orderNumber: order.orderNumber,
        productName: orderItem.productDetails.name,
        deliveryDate: order.actualDelivery
      }
    });

  } catch (error) {
    console.error('Can review product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check review eligibility',
      error: error.message
    });
  }
};

// Helper function to update product rating
const updateProductRating = async (productId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId), isApproved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const { averageRating = 0, totalReviews = 0 } = stats[0] || {};

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      numReviews: totalReviews
    });

  } catch (error) {
    console.error('Update product rating error:', error);
  }
};