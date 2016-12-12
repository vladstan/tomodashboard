const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const {
  globalIdField,
  connectionArgs,
  connectionFromPromisedArray,
} = require('graphql-relay');

const User = require('./User');
const IncomingReq = require('./IncomingReq');

const db = require('../database');
const {nodeInterface} = require('../node-definitions');

const Agent = new GraphQLObjectType({
  name: 'Agent',
  fields: () => ({
    id: globalIdField('Agent', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    fbUserId: {
      type: GraphQLString,
      resolve: (doc) => doc.fbUserId,
    },
    name: {
      type: GraphQLString,
      resolve: (doc) => doc.name,
    },
    email: {
      type: GraphQLString,
      resolve: (doc) => doc.email,
    },
    pictureUrl: {
      type: GraphQLString,
      resolve: (doc) => doc.pictureUrl,
    },
    largePictureUrl: {
      type: GraphQLString,
      resolve: (doc) => doc.largePictureUrl || doc.pictureUrl,
    },
    fbAccessToken: {
      type: GraphQLString,
      resolve: (doc) => doc.fbAccessToken,
    },
    incomingReqs: {
      type: IncomingReq.connectionType,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromPromisedArray(db.getIncomingReqs(), args),
    },
    users: {
      type: User.connectionType,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromPromisedArray(db.getUsersForAgent(doc._id), args),
    },
    lastReadWatermark: {
      type: GraphQLString,
      resolve: (doc) => '' + (doc.lastReadWatermark || 0),
    },
    lastDeliveredWatermark: {
      type: GraphQLString,
      resolve: (doc) => '' + (doc.lastDeliveredWatermark || 0),
    },
    lastCreditAmount: {
      type: GraphQLInt,
      async resolve(doc) {
        const lastCredit = await db.getLastCreditForAgent(doc._id);
        // console.log('LAST CREDIT', lastCredit);
        return lastCredit && lastCredit.amount || 0;
      },
    },
    totalPaidTrips: {
      type: GraphQLInt,
      resolve: (doc) => db.getTotalPaidTripsForAgent(doc._id),
    },
    totalUnpaidTrips: {
      type: GraphQLInt,
      resolve: (doc) => db.getTotalUnpaidTripsForAgent(doc._id),
    },
    totalUnpaidMoney: {
      type: GraphQLInt,
      resolve: (doc) => db.getTotalUnpaidMoneyForAgent(doc._id),
    },
    totalPaidMoney: {
      type: GraphQLInt,
      resolve: (doc) => db.getTotalPaidMoneyForAgent(doc._id),
    },
    averagePayPerTrip: {
      type: GraphQLInt,
      resolve: (doc) => db.getAveragePayPerTripForAgent(doc._id),
    },
  }),
  interfaces: [nodeInterface],
});

module.exports = Agent;
