const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const {
  globalIdField,
} = require('graphql-relay');

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
  interfaces: [require('../node-definitions').nodeInterface],
});

module.exports = SummaryField;
