const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  groupName: { type: String, required: true }, 
  phoneNumbers: { type: [String], required: true },
});

module.exports = mongoose.model('Contact', ContactSchema);
