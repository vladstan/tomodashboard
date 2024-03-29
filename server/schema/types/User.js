const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
  connectionArgs,
  connectionFromArray,
} = require('graphql-relay');

const MessageModel = require('../../models/Message');
const ProfileModel = require('../../models/Profile');
const SessionModel = require('../../models/Session');
const TripModel = require('../../models/Trip');

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
      type: require('./Profile'),
      resolve: (doc) => ProfileModel.findOne({userId: doc._id}),
    },
    messages: {
      type: require('../connections').MessagesConnection,
      args: connectionArgs,
      async resolve(doc, args) {
        const session = await SessionModel.findOne({userId: doc._id});
        if (!session) {
          return connectionFromArray([], args);
        }
        const messages = await MessageModel.find({sessionId: session._id});
        return connectionFromArray(messages, args);
      },
    },
    trip: {
      type: require('./Trip'),
      args: {
        _id: {type: GraphQLString},
      },
      resolve: (doc, args) => TripModel.findOne({_id: args._id}),
    },
    trips: {
      type: require('../connections').TripsConnection,
      args: connectionArgs,
      async resolve(doc, args) {
        const trips = await TripModel.find({userId: doc._id});
        return connectionFromArray(trips, args);
      },
    },
    botMuted: {
      type: GraphQLBoolean,
      resolve: (doc) => !!doc.botMuted,
    },
    stripe: {
      type: require('./StripeCredentials'),
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
  interfaces: [require('../node-definitions').nodeInterface],
});

module.exports = User;
