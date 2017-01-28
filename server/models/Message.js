const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sessionId: {type: String, required: true},
  type: {type: String, enum: ['text', 'card', 'image', 'cards'], required: true},
  text: {type: String}, // TODO other message types
  imageUrl: {type: String}, // TODO other message types
  cards: [{
    url: String,
    pictureUrl: String,
    title: String,
    description: String,
    buttons: [{
      title: String,
      payload: String,
    }],
  }],
  entities: {type: Object, default: {}},
  senderId: {type: String, required: true},
  receiverId: {type: String, required: true},
  senderType: {type: String, enum: ['bot', 'user', 'agent'], required: true},
  receiverType: {type: String, enum: ['bot', 'user', 'agent'], required: true},
  createdAt: {type: Date, default: Date.now},
  timestamp: {type: Number, default: 0},
  delivered: {type: Boolean, default: false},
});

module.exports = mongoose.model('Message', messageSchema);
