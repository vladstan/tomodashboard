const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
  connectionDefinitions,
} = require('graphql-relay');

const {nodeInterface} = require('../node-definitions');

const TripFlight = new GraphQLObjectType({
  name: 'TripFlight',
  fields: {
    id: globalIdField('TripFlight', (doc) => doc._id),
    pictureUrl: {
      type: GraphQLString,
    },
    airline: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLString,
    },
  },
  interfaces: [nodeInterface],
});

const defs = connectionDefinitions({
  name: 'flights',
  nodeType: TripFlight,
});

TripFlight.edgeType = defs.edgeType;
TripFlight.connectionType = defs.connectionType;

module.exports = TripFlight;
