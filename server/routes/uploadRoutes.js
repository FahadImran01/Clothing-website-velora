const express = require('express');
const router = express.Router();
const { uploadImages } = require('../controllers/uploadController');
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, upload.array('images', 8), uploadImages);

module.exports = router;
