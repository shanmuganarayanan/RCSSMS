const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  sendDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' }, 
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  groupIds: {type : [String]}
});

module.exports = mongoose.model('Campaign', CampaignSchema);
