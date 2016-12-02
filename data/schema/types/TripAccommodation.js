import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay';

import {nodeInterface} from '../nodeDefinitions';

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

export default TripAccommodation;
