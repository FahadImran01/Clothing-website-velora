const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const logActivity = require('../utils/activityLogger');

// @desc    Get all customers (admin)
// @route   GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    const query = { role: 'customer' };
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
      ];
    }
    const users = await User.find(query).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer with order history (admin)
// @route   GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
    res.json({ user, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Enable/disable a customer account (admin)
// @route   PUT /api/users/:id/status
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot disable an admin account' });
    }
    user.isActive = !user.isActive;
    await user.save();
    await logActivity(req.user, `${user.isActive ? 'Enabled' : 'Disabled'} customer account`, 'Customer', user.name);
    res.json({ message: `Account ${user.isActive ? 'enabled' : 'disabled'} successfully`, isActive: user.isActive });
  } catch (error) {
    next(error);
  }
};

// @desc    Get wishlist for current user
// @route   GET /api/users/me/wishlist
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle a product in the current user's wishlist
// @route   PUT /api/users/me/wishlist/:productId
const toggleWishlist = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const user = await User.findById(req.user._id);
    const index = user.wishlist.findIndex((id) => id.toString() === req.params.productId);

    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(req.params.productId);
    }

    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Add/update an address for current user
// @route   POST /api/users/me/addresses
const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an address for current user
// @route   DELETE /api/users/me/addresses/:addressId
const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  toggleUserStatus,
  getWishlist,
  toggleWishlist,
  addAddress,
  deleteAddress,
};
