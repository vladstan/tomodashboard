const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
} = require('graphql-relay');

const TripFlight = require('./TripFlight');
const TripAccommodation = require('./TripAccommodation');
const TripActivity = require('./TripActivity');

const {nodeInterface} = require('../node-definitions');

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

module.exports = Trip;
