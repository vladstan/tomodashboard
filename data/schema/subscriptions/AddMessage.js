import {
  GraphQLString,
} from 'graphql';

import {
  offsetToCursor,
} from 'graphql-relay';

import User from '../types/User';
import Message from '../types/Message';

import * as db from '../../database';
import { subscriptionWithClientId } from 'graphql-relay-subscription';

const AddMessageSubscription = subscriptionWithClientId({
  name: 'AddMessageSubscription',
  inputFields: {
    userId: { type: GraphQLString },
  },
  outputFields: {
    message: {
      type: Message,
      resolve: (doc) => doc,
    },
    messageEdge: {
      type: Message.edgeType,
      resolve: async (doc) => {
        const userId = doc.senderType === 'user' ? doc.senderId : doc.receiverId;
        const messages = await db.getMessagesForUser(userId);
        const offset = messages.length - 1;
        const cursor = offsetToCursor(offset);

        return {
          cursor: cursor,
          node: doc,
        };
      },
    },
    user: {
      type: User,
      resolve: (doc) => {
        const userId = doc.senderType === 'user' ? doc.senderId : doc.receiverId;
        return db.getUser(userId);
      },
    },
  },
  subscribe: (input, context) => {
    console.log('subscribing to:', `add_message:${input.userId}`);
    context.subscribe(`add_message:${input.userId}`);
  },
});

export default AddMessageSubscription;
