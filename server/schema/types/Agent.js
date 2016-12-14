const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const {
  globalIdField,
  connectionArgs,
  connectionFromArray,
} = require('graphql-relay');

const ActionMessageModel = require('../../models/ActionMessage');
const AgentCreditModel = require('../../models/AgentCredit');
const UserModel = require('../../models/User');

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
    incomingRequests: {
      type: require('./IncomingRequest').connectionType,
      args: connectionArgs,
      async resolve(doc, args) {
        const requests = await ActionMessageModel.find();
        return connectionFromArray(requests, args);
      },
    },
    users: {
      type: require('./User').connectionType,
      args: connectionArgs,
      async resolve(doc, args) {
        const users = await UserModel.find();
        return connectionFromArray(users, args);
      },
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
        const credit = await AgentCreditModel.findOne({agentId: doc._id}).sort({createdAt: -1});
        return credit && credit.amount || 0;
      },
    },
    totalPaidTrips: {
      type: GraphQLInt,
      async resolve(doc) {
        const credits = await AgentCreditModel.find({agentId: doc._id, paid: true});
        return credits.length; // TODO not necessarily
      },
    },
    totalUnpaidTrips: {
      type: GraphQLInt,
      async resolve(doc) {
        const credits = await AgentCreditModel.find({agentId: doc._id, paid: false});
        return credits.length; // TODO not necessarily
      },
    },
    totalUnpaidMoney: {
      type: GraphQLInt,
      async resolve(doc) {
        const credits = await AgentCreditModel.find({agentId: doc._id, paid: false});
        return credits.reduce((sumAcc, credit) => sumAcc + credit.amount, 0);
      },
    },
    totalPaidMoney: {
      type: GraphQLInt,
      async resolve(doc) {
        const credits = await AgentCreditModel.find({agentId: doc._id, paid: true});
        return credits.reduce((sumAcc, credit) => sumAcc + credit.amount, 0);
      },
    },
    averagePayPerTrip: {
      type: GraphQLInt,
      async resolve(doc) {
        const credits = await AgentCreditModel.find({agentId: doc._id, paid: true});
        const trips = credits.length; // TODO not necessarily
        const sum = credits.reduce((sumAcc, credit) => sumAcc + credit.amount, 0);
        return trips && (sum / trips) || 0;
      },
    },
  }),
  interfaces: [nodeInterface],
});

module.exports = Agent;
