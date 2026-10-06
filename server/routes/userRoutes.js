const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  toggleUserStatus,
  getWishlist,
  toggleWishlist,
  addAddress,
  deleteAddress,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Customer routes (self)
router.get('/me/wishlist', protect, getWishlist);
router.put('/me/wishlist/:productId', protect, toggleWishlist);
router.post('/me/addresses', protect, addAddress);
router.delete('/me/addresses/:addressId', protect, deleteAddress);

// Admin routes
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id/status', protect, admin, toggleUserStatus);

module.exports = router;
