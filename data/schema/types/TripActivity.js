import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay';

import {nodeInterface} from '../nodeDefinitions';

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

export default TripActivity;
