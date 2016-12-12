const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
  connectionDefinitions,
} = require('graphql-relay');

const {nodeInterface} = require('../node-definitions');

const TripActivity = new GraphQLObjectType({
  name: 'TripActivity',
  fields: {
    id: globalIdField('TripActivity', (doc) => doc._id),
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
  name: 'activities',
  nodeType: TripActivity,
});

TripActivity.edgeType = defs.edgeType;
TripActivity.connectionType = defs.connectionType;

module.exports = TripActivity;
