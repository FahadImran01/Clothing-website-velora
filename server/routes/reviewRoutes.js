const express = require('express');
const router = express.Router();
const { getReviews, createReview, approveReview, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getReviews);
router.post('/', protect, createReview);
router.put('/:id/approve', protect, admin, approveReview);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;
