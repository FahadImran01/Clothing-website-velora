const ActivityLog = require('../models/ActivityLog');

// @desc    Get recent admin activity logs
// @route   GET /api/activity-logs (admin)
const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(200);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivityLogs };
