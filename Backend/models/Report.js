const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  status: { type: String, required: true }, 
  deliveryTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', ReportSchema);
