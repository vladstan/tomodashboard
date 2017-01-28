const debug = require('debug');

const TextMessage = require('./fbmessages/TextMessage');
const GenericMessage = require('./fbmessages/GenericMessage');
const ImageMessage = require('./fbmessages/ImageMessage');

const facebookReply = require('./facebookReply');
const log = debug('tomo:bot');

function sendMessage(msg) {
  log('sendMessage()');

  if (msg.type === 'text') {
    return facebookReply.messages(msg.receiverFacebookId, new TextMessage(msg.text));
  }

  if (msg.type === 'image') {
    return facebookReply.messages(msg.receiverFacebookId, new ImageMessage(msg.imageUrl));
  }

  if (msg.type === 'cards') {
    let genericMessage = new GenericMessage();

    for (const card of msg.cards) {
      genericMessage = genericMessage
        .addBubble(card.title, (card.description || '').substr(0, 80))
        .addUrl(card.link)
        .addImage(card.pictureUrl);

      for (const btn of card.buttons) {
        genericMessage = genericMessage
          .addButton(btn.title, btn.url || btn.payload);
      }
    }

    return facebookReply.messages(msg.receiverFacebookId, genericMessage);
  }

  throw new Error('unsupported msg.type');
}

function markConvAsRead(receiverFacebookId) {
  log('markConvAsRead()');
  return facebookReply.actions(receiverFacebookId, 'mark_seen');
}

function sendTypingStatus(receiverFacebookId, isTyping) {
  log('sendTypingStatus()');
  return facebookReply.actions(receiverFacebookId, isTyping ? 'typing_on' : 'typing_off');
}

module.exports = {
  sendMessage,
  markConvAsRead,
  sendTypingStatus,
};
