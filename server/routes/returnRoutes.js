const express = require('express');
const router = express.Router();
const { createReturnRequest, getReturnRequests, updateReturnStatus } = require('../controllers/returnController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');

router.post('/', optionalAuth, createReturnRequest);
router.get('/', protect, admin, getReturnRequests);
router.put('/:id', protect, admin, updateReturnStatus);

module.exports = router;
