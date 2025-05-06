const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: String,
  message: String,
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  status: { type: String, default: 'Pending' },
  sendDate: Date
});

module.exports = mongoose.model('Campaign', campaignSchema);
