const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const {
  globalIdField,
  connectionDefinitions,
} = require('graphql-relay');

const {nodeInterface} = require('../node-definitions');

const SummaryField = new GraphQLObjectType({
  name: 'SummaryField',
  fields: () => ({
    id: globalIdField('SummaryField', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    name: {type: GraphQLString},
    price: {type: GraphQLInt},
    segments: {type: GraphQLInt},
    segmentPrice: {type: GraphQLInt},
  }),
  interfaces: [nodeInterface],
});

const defs = connectionDefinitions({
  name: 'summaryFields',
  nodeType: SummaryField,
});

SummaryField.edgeType = defs.edgeType;
SummaryField.connectionType = defs.connectionType;

module.exports = SummaryField;
