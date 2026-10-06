const Product = require('../models/Product');
const logActivity = require('../utils/activityLogger');

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      gender,
      size,
      color,
      minPrice,
      maxPrice,
      minRating,
      sort,
      page = 1,
      limit = 12,
      featured,
      newArrival,
      onSale,
    } = req.query;

    const query = {};

    if (keyword) {
      query.$text = { $search: keyword };
    }
    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (size) query.sizes = size;
    if (color) query.colors = color;
    if (minRating) query.rating = { $gte: Number(minRating) };
    if (featured === 'true') query.isFeatured = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (onSale === 'true') query.isOnSale = true;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'popular') sortOption = { numReviews: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by id
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products (admin)
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    await logActivity(req.user, 'Created product', 'Product', product.name);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id (admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    Object.assign(product, req.body);
    const updated = await product.save();
    await logActivity(req.user, 'Updated product', 'Product', updated.name);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id (admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const productName = product.name;
    await product.deleteOne();
    await logActivity(req.user, 'Deleted product', 'Product', productName);
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
