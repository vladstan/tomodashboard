const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
  connectionDefinitions,
} = require('graphql-relay');

const {
  getUser,
} = require('../database');

const User = require('./User');

const {nodeInterface} = require('../node-definitions');

const IncomingReq = new GraphQLObjectType({
  name: 'IncomingReq',
  fields: () => ({
    id: globalIdField('IncomingReq', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    type: {
      type: GraphQLString,
      resolve: (doc) => doc.type,
    },
    userId: {
      type: GraphQLString,
      resolve: (doc) => doc.userId,
    },
    messageText: {
      type: GraphQLString,
      resolve: (doc) => doc.messageText,
    },
    user: {
      type: User,
      resolve: (doc) => getUser(doc.userId),
    },
    // createdAt: {
    //   type: GraphQLString,
    //   resolve: (doc) => doc.type,
    // },
  }),
  interfaces: [nodeInterface],
});

const defs = connectionDefinitions({
  name: 'incomingReqs',
  nodeType: IncomingReq,
});

IncomingReq.edgeType = defs.edgeType;
IncomingReq.connectionType = defs.connectionType;

module.exports = IncomingReq;
