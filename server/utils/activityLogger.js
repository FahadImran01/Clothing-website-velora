const ActivityLog = require('../models/ActivityLog');

// Never throws and never blocks the response if logging fails.
const logActivity = async (adminUser, action, targetType, targetLabel = '', details = '') => {
  try {
    await ActivityLog.create({
      admin: adminUser?._id || null,
      adminName: adminUser?.name || 'Unknown Admin',
      action,
      targetType,
      targetLabel,
      details,
    });
  } catch (error) {
    console.error('Could not write activity log:', error.message);
  }
};

module.exports = logActivity;
