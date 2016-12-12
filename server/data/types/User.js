const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
  connectionArgs,
  connectionFromPromisedArray,
  connectionDefinitions,
} = require('graphql-relay');

const {
  getProfileOfUser,
  getMessagesForUser,
  getTripsForUser,
} = require('../database');

const Profile = require('./Profile');
const Trip = require('./Trip');
const Message = require('./Message');
const StripeCredentials = require('./StripeCredentials');

const {nodeInterface} = require('../node-definitions');

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    facebookId: {
      type: GraphQLString,
      resolve: (doc) => doc.facebookId,
    },
    profile: {
      type: Profile,
      resolve: (doc) => getProfileOfUser(doc._id),
    },
    messages: {
      type: Message.connectionType,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromPromisedArray(getMessagesForUser(doc._id), args),
    },
    trips: {
      type: Trip.connectionType,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromPromisedArray(getTripsForUser(doc._id), args),
    },
    botMuted: {
      type: GraphQLBoolean,
      resolve: (doc) => !!doc.botMuted
    },
    stripe: {
      type: StripeCredentials,
      resolve: (doc) => doc.stripe,
    },
    lastReadWatermark: {
      type: GraphQLString,
      resolve: (doc) => '' + (doc.lastReadWatermark || 0),
    },
    lastDeliveredWatermark: {
      type: GraphQLString,
      resolve: (doc) => '' + (doc.lastDeliveredWatermark || 0),
    },
  }),
  interfaces: [nodeInterface],
});

const defs = connectionDefinitions({
  name: 'users',
  nodeType: User,
});

User.edgeType = defs.edgeType;
User.connectionType = defs.connectionType;

module.exports = User;
