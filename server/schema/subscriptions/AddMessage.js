const {
  GraphQLString,
} = require('graphql');

const {
  cursorForObjectInConnection,
} = require('graphql-relay');

const Message = require('../types/Message');

const db = require('../database');
const {subscriptionWithClientId} = require('graphql-relay-subscription');

const AddMessageSubscription = subscriptionWithClientId({
  name: 'AddMessageSubscription',
  inputFields: {
    userId: {type: GraphQLString},
  },
  outputFields: {
    message: {
      type: Message,
      resolve: (doc) => doc,
    },
    messageEdge: {
      type: Message.edgeType,
      async resolve(doc) {
        const userId = doc.senderType === 'user' ? doc.senderId : doc.receiverId;
        const messages = await db.getMessagesForUser(userId);
        const msgDoc = messages.find(m => ('' + m._id) == ('' + doc._id));

        return {
          cursor: cursorForObjectInConnection(messages, msgDoc),
          node: msgDoc,
        };
      },
    },
  },
  subscribe: (input, context) => {
    console.log('subscribing to:', `add_message:${input.userId}`);
    context.subscribe(`add_message:${input.userId}`);
  },
});

module.exports = AddMessageSubscription;
