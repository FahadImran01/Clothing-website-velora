const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    adminName: { type: String, required: true },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetLabel: { type: String, default: '' },
    details: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
