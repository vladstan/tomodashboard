const mongoose = require('mongoose');

const agentCreditSchema = new mongoose.Schema({
  agentId: {type: String, required: true},
  summaryId: {type: String, required: true},
  chargeId: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  paid: {type: Boolean, default: false},
  amount: {type: Number, default: 0},
});

module.exports = mongoose.model('AgentCredit', agentCreditSchema);
