const mongoose = require('mongoose');

const actionMessageSchema = new mongoose.Schema({
  type: {type: String, enum: ['init', 'text'], required: true},
  userId: {type: String, unique: true, required: true},
  messageText: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('ActionMessage', actionMessageSchema);
