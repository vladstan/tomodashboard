import rp from 'request-promise';

const API_URL = 'https://okclaire-87586.onmodulus.net';

export function sendMessage(msg) {
  console.log('okclaire.sendMessage()');
  return rp({
    method: 'POST',
    baseUrl: API_URL,
    url: '/messages',
    json: {
      messages: [msg]
    },
  }).then((res) => {
    console.log('sent', msg, 'to OkClaire:', res);
    return res;
  });
}
