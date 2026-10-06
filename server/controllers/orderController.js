const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const logActivity = require('../utils/activityLogger');

const CANCELLABLE_STATUSES = ['Pending', 'Confirmed'];

// @desc    Create new order (checkout) — works for logged-in customers and guests
// @route   POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingInfo, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cannot place an order with an empty cart' });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name || item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} is out of stock or insufficient quantity available` });
      }

      const price = product.discountPrice || product.price;
      subtotal += price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      });
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && coupon.expiryDate > new Date() && subtotal >= coupon.minOrderAmount) {
        discount = (subtotal * coupon.discountPercentage) / 100;
      }
    }

    const shippingCost = subtotal > 100 ? 0 : 10;
    const total = subtotal - discount + shippingCost;

    const order = await Order.create({
      user: req.user?._id || null,
      items: orderItems,
      shippingInfo,
      paymentMethod: paymentMethod || 'cod',
      couponCode: couponCode || null,
      subtotal,
      shippingCost,
      discount,
      total,
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order (owner or admin)
// @route   GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;
    if (req.body.status === 'Delivered') {
      order.isPaid = true;
      order.paidAt = new Date();
    }

    const updated = await order.save();
    await logActivity(req.user, `Updated order status to "${updated.status}"`, 'Order', `#${updated._id.toString().slice(-8).toUpperCase()}`);

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an order — the logged-in owner, a guest with the checkout email, or an admin
// @route   PUT /api/orders/:id/cancel
const cancelOrder = async (req, res, next) => {
  try {
    const { email } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = req.user && order.user && order.user.toString() === req.user._id.toString();
    const isAdminUser = req.user && req.user.role === 'admin';
    const emailMatches = email && order.shippingInfo?.email?.toLowerCase() === email.trim().toLowerCase();

    if (!isOwner && !isAdminUser && !emailMatches) {
      return res.status(403).json({ message: 'We could not verify this order. Please check your details and try again.' });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'This order has already been cancelled' });
    }

    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      return res.status(400).json({ message: `This order can no longer be cancelled — it is already ${order.status.toLowerCase()}.` });
    }

    order.status = 'Cancelled';
    const updated = await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Track an order publicly using order ID + the email used at checkout
// @route   GET /api/orders/track/:id
const trackOrder = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Please provide the email used when placing this order' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'No order found with that Order ID. Please double-check and try again.' });
    }

    const orderEmail = order.shippingInfo?.email?.toLowerCase();
    if (orderEmail !== email.trim().toLowerCase()) {
      return res.status(404).json({ message: 'We could not find a matching order for that Order ID and email.' });
    }

    res.json({
      _id: order._id,
      status: order.status,
      items: order.items,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      discount: order.discount,
      total: order.total,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      shippingCity: order.shippingInfo?.city,
      shippingCountry: order.shippingInfo?.country,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder, trackOrder };
