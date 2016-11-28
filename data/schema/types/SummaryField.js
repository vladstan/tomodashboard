import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay';

import {nodeInterface} from '../nodeDefinitions';

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

export default SummaryField;
