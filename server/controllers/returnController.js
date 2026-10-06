const ReturnRequest = require('../models/ReturnRequest');
const Order = require('../models/Order');
const logActivity = require('../utils/activityLogger');

// @desc    Submit a return request for a delivered order (customer or guest)
// @route   POST /api/returns
const createReturnRequest = async (req, res, next) => {
  try {
    const { orderId, reason, email } = req.body;

    if (!orderId || !reason) {
      return res.status(400).json({ message: 'Please provide the order and a reason for the return' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = req.user && order.user && order.user.toString() === req.user._id.toString();
    const emailMatches = email && order.shippingInfo?.email?.toLowerCase() === email.trim().toLowerCase();

    if (!isOwner && !emailMatches) {
      return res.status(403).json({ message: 'We could not verify this order. Please check your details and try again.' });
    }

    if (order.status !== 'Delivered') {
      return res.status(400).json({ message: 'Only delivered orders are eligible for a return request' });
    }

    const existing = await ReturnRequest.findOne({ order: order._id });
    if (existing) {
      return res.status(400).json({ message: 'A return request has already been submitted for this order' });
    }

    const returnRequest = await ReturnRequest.create({
      order: order._id,
      user: order.user || null,
      email: order.shippingInfo.email,
      reason,
    });

    res.status(201).json(returnRequest);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all return requests (admin)
// @route   GET /api/returns
const getReturnRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const requests = await ReturnRequest.find(query)
      .populate('order', 'total status createdAt')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a return request's status (admin)
// @route   PUT /api/returns/:id
const updateReturnStatus = async (req, res, next) => {
  try {
    const request = await ReturnRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Return request not found' });

    request.status = req.body.status || request.status;
    const updated = await request.save();

    await logActivity(req.user, `Updated return request status to "${updated.status}"`, 'ReturnRequest', updated._id.toString());

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReturnRequest, getReturnRequests, updateReturnStatus };
