import rp from 'request-promise';

const API_URL = 'https://yagobot-91541.onmodulus.net';
// const API_URL = 'https://efb51b44.ngrok.io';

export function sendMessage(msg) {
  console.log('TomoBot.sendMessage()');
  return rp({
    method: 'POST',
    baseUrl: API_URL,
    url: '/messages',
    json: {
      messages: [msg]
    },
  }).then((res) => {
    console.log('sent', msg, 'to TomoBot:', res);
    return res;
  });
}

export function markConvAsRead(receiverFacebookId) {
  console.log('TomoBot.markConvAsRead()');
  return rp({
    method: 'POST',
    baseUrl: API_URL,
    url: '/messages/read',
    json: {
      receiverFacebookId
    },
  }).then((res) => {
    console.log('marked conv for fb user ' + receiverFacebookId + ' as read through TomoBot:', res);
    return res;
  });
}
