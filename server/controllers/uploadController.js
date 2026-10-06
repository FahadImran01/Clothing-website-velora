// @desc    Upload one or more product images
// @route   POST /api/upload (admin)
const uploadImages = (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please select at least one image to upload' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const urls = req.files.map((file) => `${baseUrl}/uploads/${file.filename}`);

    res.status(201).json({ urls });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImages };
