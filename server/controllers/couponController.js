const Coupon = require('../models/Coupon');
const logActivity = require('../utils/activityLogger');

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

// @desc    Validate a coupon code for checkout (customer)
// @route   GET /api/coupons/validate/:code
const validateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid or inactive coupon code' });
    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }
    res.json(coupon);
  } catch (error) {
    next(error);
  }
};

// @desc    Create coupon (admin)
// @route   POST /api/coupons
const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    await logActivity(req.user, 'Created coupon', 'Coupon', coupon.code);
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

// @desc    Update coupon (admin)
// @route   PUT /api/coupons/:id
const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    Object.assign(coupon, req.body);
    const updated = await coupon.save();
    await logActivity(req.user, 'Updated coupon', 'Coupon', updated.code);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon (admin)
// @route   DELETE /api/coupons/:id
const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    const couponCode = coupon.code;
    await coupon.deleteOne();
    await logActivity(req.user, 'Deleted coupon', 'Coupon', couponCode);
    res.json({ message: 'Coupon removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCoupons, validateCoupon, createCoupon, updateCoupon, deleteCoupon };
