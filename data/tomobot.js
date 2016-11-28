import superagent from 'superagent-bluebird-promise';

const API_URL = 'https://yagobot-91541.onmodulus.net';
// const API_URL = 'https://efb51b44.ngrok.io';

export function sendMessage(msg) {
  console.log('TomoBot.sendMessage()');
  return superagent
    .post(API_URL + '/messages')
    .send({messages: [msg]})
    .set('Content-Type', 'application/json')
    .then((res) => {
      console.log('sent', msg, 'to TomoBot:');
      return res;
    });
}

export function markConvAsRead(receiverFacebookId) {
  console.log('TomoBot.markConvAsRead()');
  return superagent
    .post(API_URL + '/messages/read')
    .send({receiverFacebookId})
    .set('Content-Type', 'application/json')
    .then((res) => {
      console.log('marked conv for fb user ' + receiverFacebookId + ' as read through TomoBot:');
      return res;
    });
}

export function sendTypingStatus(receiverFacebookId, isTyping) {
  console.log('TomoBot.sendTypingStatus()');
  return superagent
    .post(API_URL + '/typing_status')
    .send({receiverFacebookId, isTyping})
    .set('Content-Type', 'application/json')
    .then((res) => {
      console.log('set typing status for fb user ' + receiverFacebookId + ' to:', isTyping);
      return res;
    });
}
