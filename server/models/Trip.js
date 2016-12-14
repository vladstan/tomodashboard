const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  status: {type: String, enum: ['draft'], required: true},
  agentId: {type: String, required: true},
  userId: {type: String, required: true},
  name: {type: String, required: true},
  flights: {type: Array, default: []},
  accommodation: {type: Array, default: []},
  activities: {type: Array, default: []},
});

module.exports = mongoose.model('Trip', tripSchema);
