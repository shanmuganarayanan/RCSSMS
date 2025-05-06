const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: String,
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
});

module.exports = mongoose.model('Group', groupSchema);
