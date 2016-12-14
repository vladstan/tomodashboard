const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
  connectionDefinitions,
} = require('graphql-relay');

const {nodeInterface} = require('../node-definitions');

const UserModel = require('../../models/User');

const IncomingRequest = new GraphQLObjectType({
  name: 'IncomingRequest',
  fields: () => ({
    id: globalIdField('IncomingRequest', (doc) => doc._id),
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
      type: require('./User'),
      resolve: (doc) => UserModel.findOne({_id: doc.userId}),
    },
  }),
  interfaces: [nodeInterface],
});

const defs = connectionDefinitions({
  name: 'incomingRequests',
  nodeType: IncomingRequest,
});

IncomingRequest.edgeType = defs.edgeType;
IncomingRequest.connectionType = defs.connectionType;

module.exports = IncomingRequest;
