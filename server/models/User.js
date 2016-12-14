const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  facebookId: {type: String, unique: true, required: true},
  botMuted: {type: Boolean, default: false},
  stripe: {type: Object, default: {}},
  lastReadWatermark: {type: Number, default: 0},
  lastDeliveredWatermark: {type: Number, default: 0},
});

module.exports = mongoose.model('User', userSchema);
