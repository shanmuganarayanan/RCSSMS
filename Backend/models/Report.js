const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  phoneNumber: String,
  status: String,
  messageSid: String,
  error: String,
});

module.exports = mongoose.model('Report', reportSchema);
