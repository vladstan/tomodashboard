import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  globalIdField,
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
} from 'graphql-relay';

import TripFlight from './TripFlight';
import TripAccommodation from './TripAccommodation';
import TripActivity from './TripActivity';

import {nodeInterface} from '../nodeDefinitions';

const Trip = new GraphQLObjectType({
  name: 'Trip',
  fields: {
    id: globalIdField('Trip', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    status: {
      type: GraphQLString,
      resolve: (doc) => doc.status,
    },
    userId: {
      type: GraphQLString,
      resolve: (doc) => doc.userId,
    },
    agentId: {
      type: GraphQLString,
      resolve: (doc) => doc.agentId,
    },
    name: {
      type: GraphQLString,
      resolve: (doc) => doc.name,
    },
    flights: {
      type: TripFlight.connectionType,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromArray(doc.flights || [], args),
    },
    accommodation: {
      type: TripAccommodation.connectionType,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromArray(doc.accommodation || [], args),
    },
    activities: {
      type: TripActivity.connectionType,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromArray(doc.activities || [], args),
    },
    // createdAt: {
    //   type: GraphQLString,
    //   resolve: (doc) => doc.type,
    // },
  },
  interfaces: [nodeInterface],
});

const defs = connectionDefinitions({
  name: 'trips',
  nodeType: Trip,
});

Trip.edgeType = defs.edgeType;
Trip.connectionType = defs.connectionType;

export default Trip;
