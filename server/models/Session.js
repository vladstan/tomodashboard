const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {type: String, unique: true, required: true},
  context: {type: Object, default: {}},
});

module.exports = mongoose.model('Session', sessionSchema);
