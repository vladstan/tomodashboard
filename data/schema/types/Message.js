import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay';

import {nodeInterface} from '../nodeDefinitions';

const Message = new GraphQLObjectType({
  name: 'Message',
  fields: {
    id: globalIdField('Message', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    type: {
      type: GraphQLString,
      resolve: (doc) => doc.type,
    },
    text: {
      type: GraphQLString,
      resolve: (doc) => doc.text,
    },
    cards: {
      type: GraphQLString,
      resolve: (doc) => JSON.stringify(doc.cards),
    },
    senderId: {
      type: GraphQLString,
      resolve: (doc) => doc.senderId,
    },
    receiverId: {
      type: GraphQLString,
      resolve: (doc) => doc.receiverId,
    },
    senderType: {
      type: GraphQLString,
      resolve: (doc) => doc.senderType,
    },
    receiverType: {
      type: GraphQLString,
      resolve: (doc) => doc.receiverType,
    },
    imageUrl: {
      type: GraphQLString,
      resolve: (doc) => doc.imageUrl,
    },
    timestamp: {
      type: GraphQLString,
      resolve: (doc) => '' + (doc.timestamp || 0),
    },
    // createdAt: {
    //   type: GraphQLString,
    //   resolve: (doc) => doc.type,
    // },
  },
  interfaces: [nodeInterface],
});

const defs = connectionDefinitions({
  name: 'messages',
  nodeType: Message,
});

Message.edgeType = defs.edgeType;
Message.connectionType = defs.connectionType;

export default Message;
