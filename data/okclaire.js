import rp from 'request-promise';

const API_URL = 'https://yagobot-91541.onmodulus.net';
// const API_URL = 'https://efb51b44.ngrok.io';

export function sendMessage(msg) {
  console.log('YagoBot.sendMessage()');
  return rp({
    method: 'POST',
    baseUrl: API_URL,
    url: '/messages',
    json: {
      messages: [msg]
    },
  }).then((res) => {
    console.log('sent', msg, 'to YagoBot:', res);
    return res;
  });
}
