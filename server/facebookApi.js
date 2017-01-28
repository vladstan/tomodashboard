const got = require('got');

async function postMessage(body) {
  const url = process.env.FACEBOOK_API_URL + '/me/messages';
  const options = {
    method: 'POST',
    query: {
      access_token: process.env.FACEBOOK_ACCESS_TOKEN,
    },
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': process.env.FACEBOOK_USER_AGENT,
    },
    body: JSON.stringify(body),
    json: true,
  };

  // TODO https://github.com/sindresorhus/got
  // console.log('FacebookApi', 'API request:', 'POST', url, JSON.stringify(options));
  try {
    const resp = await got(url, options);
    return resp.body;
  } catch (err) {
    console.error('FacebookApi', 'request error', err.response.body);
    throw err;
  }
}

// async getUser(id: string, fields: string[]): Object {
//   const url = config.facebookApiUrl + '/' + id;
//   const options = {
//     method: 'GET',
//     query: {
//       access_token: config.facebookAccessToken,
//       fields: fields.join(','),
//     },
//     headers: {
//       'Content-Type': 'application/json',
//       'User-Agent': config.userAgent,
//     },
//     json: true,
//   };
//
//   // TODO https://github.com/sindresorhus/got
//   log.silly('FacebookApi', 'API request:', 'GET', url, JSON.stringify(options));
//   try {
//     const resp = await got(url, options);
//     return resp.body;
//   } catch (err) {
//     log.error('FacebookApi', 'request error', err.response.body, err.response);
//     throw err;
//   }
// }

module.exports = {
  postMessage,
  // getUser,
};
