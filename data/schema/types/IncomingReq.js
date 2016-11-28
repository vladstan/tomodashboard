import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay';

import {
  getUser,
} from '../../database';

import User from './User';

import {nodeInterface} from '../nodeDefinitions';

const IncomingReq = new GraphQLObjectType({
  name: 'IncomingReq',
  fields: () => ({
    id: globalIdField('IncomingReq', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    type: {
      type: GraphQLString,
      resolve: (doc) => doc.type,
    },
    userId: {
      type: GraphQLString,
      resolve: (doc) => doc.userId,
    },
    messageText: {
      type: GraphQLString,
      resolve: (doc) => doc.messageText,
    },
    user: {
      type: User,
      resolve: (doc) => getUser(doc.userId),
    },
    // createdAt: {
    //   type: GraphQLString,
    //   resolve: (doc) => doc.type,
    // },
  }),
  interfaces: [nodeInterface],
});

const defs = connectionDefinitions({
  name: 'incomingReqs',
  nodeType: IncomingReq,
});

IncomingReq.edgeType = defs.edgeType;
IncomingReq.connectionType = defs.connectionType;

export default IncomingReq;
