import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay';

import {nodeInterface} from '../nodeDefinitions';

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

export default TripFlight;
