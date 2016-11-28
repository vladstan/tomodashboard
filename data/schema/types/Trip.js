import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay';

import {nodeInterface} from '../nodeDefinitions';

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

export default Trip;
