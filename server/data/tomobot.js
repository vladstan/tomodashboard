const superagent = require('superagent');

function sendMessage(msg) {
  console.log('bot.sendMessage()');
  return superagent
    .post(process.env.BOT_API_URL + '/messages')
    .set('Content-Type', 'application/json')
    .send({messages: [msg]});
}

async function markConvAsRead(receiverFacebookId) {
  console.log('bot.markConvAsRead()');
  return superagent
    .post(process.env.BOT_API_URL + '/messages/read')
    .set('Content-Type', 'application/json')
    .send({receiverFacebookId});
}

async function sendTypingStatus(receiverFacebookId, isTyping) {
  console.log('bot.sendTypingStatus()');
  return superagent
    .post(process.env.BOT_API_URL + '/typing_status')
    .set('Content-Type', 'application/json')
    .send({receiverFacebookId, isTyping});
}

module.exports = {
  sendMessage,
  markConvAsRead,
  sendTypingStatus,
};
