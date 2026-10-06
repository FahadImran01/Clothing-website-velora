const Review = require('../models/Review');
const Product = require('../models/Product');
const logActivity = require('../utils/activityLogger');

// Recalculate a product's average rating and review count from approved reviews
const recalcProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId, isApproved: true });
  const numReviews = reviews.length;
  const rating = numReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews : 0;
  await Product.findByIdAndUpdate(productId, { rating, numReviews });
};

// @desc    Get reviews (all for admin, or approved-only for a product)
// @route   GET /api/reviews
const getReviews = async (req, res, next) => {
  try {
    const { product, allStatuses } = req.query;
    const query = {};
    if (product) query.product = product;
    if (!allStatuses) query.isApproved = true;

    const reviews = await Review.find(query).populate('product', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review
// @route   POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { product, rating, comment } = req.body;

    const exists = await Review.findOne({ product, user: req.user._id });
    if (exists) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product,
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a review (admin)
// @route   PUT /api/reviews/:id/approve
const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.isApproved = true;
    await review.save();
    await recalcProductRating(review.product);
    await logActivity(req.user, 'Approved review', 'Review', review.name);

    res.json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review (admin)
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const productId = review.product;
    const reviewerName = review.name;
    await review.deleteOne();
    await recalcProductRating(productId);
    await logActivity(req.user, 'Deleted review', 'Review', reviewerName);

    res.json({ message: 'Review removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReviews, createReview, approveReview, deleteReview };
