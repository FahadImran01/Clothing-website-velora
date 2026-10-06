const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder, trackOrder,
} = require('../controllers/orderController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');

router.get('/track/:id', trackOrder);
router.get('/', protect, admin, getAllOrders);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/', optionalAuth, createOrder);
router.put('/:id/cancel', optionalAuth, cancelOrder);
router.put('/:id', protect, admin, updateOrderStatus);

module.exports = router;
