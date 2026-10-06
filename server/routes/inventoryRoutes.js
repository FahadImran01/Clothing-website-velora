const express = require('express');
const router = express.Router();
const { getInventory, updateStock } = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getInventory);
router.put('/:id', protect, admin, updateStock);

module.exports = router;
