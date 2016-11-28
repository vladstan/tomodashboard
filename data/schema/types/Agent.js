import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

import {
  globalIdField,
  connectionArgs,
  connectionFromPromisedArray,
} from 'graphql-relay';

import User from './User';
import Message from './Message';
import IncomingReq from './IncomingReq';

import * as db from '../../database';
import {nodeInterface} from '../nodeDefinitions';

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
      resolve: async (doc) => {
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

export default Agent;
