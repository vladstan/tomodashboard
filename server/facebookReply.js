const FacebookMessage = require('./fbmessages/FacebookMessage');

const facebookApi = require('./facebookApi');

async function messages(recipientId, ...messages) {
  const results = [];

  for (let message of messages) {
    if (message instanceof FacebookMessage) {
      message = message.get();
    }

    const body = {
      recipient: {
        id: recipientId,
      },
      message: message,
    };

    // Await in series to ensure messages are sent in order
    const result = await facebookApi.postMessage(body); // eslint-disable-line babel/no-await-in-loop
    results.push(result);
  }

  return results;
}

async function actions(recipientId, ...actions) {
  const results = [];

  for (const action of actions) {
    const body = {
      recipient: {
        id: recipientId,
      },
      sender_action: action,
    };

    // Await in series to ensure actions are sent in order
    const result = await facebookApi.postMessage(body); // eslint-disable-line babel/no-await-in-loop
    results.push(result);
  }

  return results;
}

module.exports = {
  messages,
  actions,
};
