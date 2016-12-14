const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
  connectionDefinitions,
} = require('graphql-relay');

const {nodeInterface} = require('../node-definitions');

const TripAccommodation = new GraphQLObjectType({
  name: 'TripAccommodation',
  fields: {
    id: globalIdField('TripAccommodation', (doc) => doc._id),
    link: {
      type: GraphQLString,
    },
    pictureUrl: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLString,
    },
  },
  interfaces: [nodeInterface],
});

const defs = connectionDefinitions({
  name: 'accommodation',
  nodeType: TripAccommodation,
});

TripAccommodation.edgeType = defs.edgeType;
TripAccommodation.connectionType = defs.connectionType;

module.exports = TripAccommodation;
