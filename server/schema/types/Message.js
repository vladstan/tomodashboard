const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
} = require('graphql-relay');

const AgentModel = require('../../models/Agent');

const Message = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
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
    senderAgent: {
      type: require('./Agent'),
      resolve: (doc) => doc.senderType === 'agent' && AgentModel.findOne({_id: doc.senderId}) || null,
    },
    // createdAt: {
    //   type: GraphQLString,
    //   resolve: (doc) => doc.type,
    // },
  }),
  interfaces: [require('../node-definitions').nodeInterface],
});

module.exports = Message;
