import {
  GraphQLObjectType,
  // GraphQLNonNull,
  // GraphQLBoolean,
  GraphQLSchema,
  GraphQLString,
  // GraphQLList,
  // GraphQLInt,
  // GraphQLID
} from 'graphql';

import {
  // toGlobalId,
  fromGlobalId,
  globalIdField,
  offsetToCursor,
  connectionArgs,
  nodeDefinitions,
  // connectionFromArray,
  connectionDefinitions,
  connectionFromPromisedArray,
  // mutationWithClientMutationId,
  cursorForObjectInConnection,
} from 'graphql-relay';

import {
  getUser,
  getProfile,
  getProfileOfUser,
  getIncomingReqs,
  getIncomingReq,
} from './database';

import { getWithType, isType } from '@sketchpixy/rubix/lib/node/relay-utils';
import { subscriptionWithClientId } from 'graphql-relay-subscription';

// INTERFACE //

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    let { type, _id } = fromGlobalId(globalId);

    if (type === 'User') {
      return getWithType(getUser(_id), 'User');
    } else if (type === 'Profile') {
      return getWithType(getProfile(_id), 'Profile');
    } else if (type === 'IncomingReq') {
      return getWithType(getIncomingReq(_id), 'IncomingReq');
    } else {
      return null;
    }
  },
  (obj) => {
    if (isType(obj, 'User')) {
      return User;
    } else if (isType(obj, 'Profile')) {
      return Profile;
    } else if (isType(obj, 'IncomingReq')) {
      return IncomingReq;
    } else {
      return null;
    }
  }
);

// TYPES //

const IncomingReq = new GraphQLObjectType({
  name: 'IncomingReq',
  fields: {
    id: globalIdField('IncomingReq', (req) => req._id),
    _id: {
      type: GraphQLString,
      resolve: (req) => req._id,
    },
    type: {
      type: GraphQLString,
      resolve: (req) => req.type,
    },
    userId: {
      type: GraphQLString,
      resolve: (req) => req.userId,
    },
    messageText: {
      type: GraphQLString,
      resolve: (req) => req.messageText,
    },
    // createdAt: {
    //   type: GraphQLString,
    //   resolve: (req) => req.type,
    // },
  },
  interfaces: [nodeInterface],
});

const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: globalIdField('Profile', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    userId: {
      type: GraphQLString,
      resolve: (doc) => doc.userId,
    },
    name: {
      type: GraphQLString,
      resolve: () => 'Alexander M.',
    },
  }),
  interfaces: [nodeInterface],
});

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    facebookId: {
      type: GraphQLString,
      resolve: (doc) => doc.facebookId,
    },
    profile: {
      type: Profile,
      resolve: (doc) => getProfileOfUser(doc._id)
    },
    incomingReqs: {
      type: IncomingReqsConnection,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromPromisedArray(getIncomingReqs(), args),
    },
  }),
  interfaces: [nodeInterface],
});

// CONNECTIONS //

const {
  connectionType: IncomingReqsConnection,
  edgeType: IncomingReqEdge
} = connectionDefinitions({
  name: 'incomingReqs',
  nodeType: IncomingReq
});

// MUTATIONS //

// SUBSCRIPTIONS //

const AddIncomingReqSubscription = subscriptionWithClientId({
  name: 'AddIncomingReqSubscription',
  outputFields: {
    incomingReq: {
      type: IncomingReq,
      resolve: (req) => req,
    },
    incomingReqEdge: {
      type: IncomingReqEdge,
      resolve: async (req) => {
        const ireqs = await getIncomingReqs();
        const ireq = await getIncomingReq(req._id);

        console.log('ireqs', ireqs);
        console.log('ireq', ireq);

        const crs = cursorForObjectInConnection(ireqs, ireq);
        console.log('ireqs.indexOf(ireq)', ireqs.indexOf(ireq));
        console.log('crs', crs);

        const offst = ireqs.length - 1;
        const offsTC = offsetToCursor();
        console.log('offsTC', offsTC, offst);

        return {
          cursor: offsTC,
          node: req,
        };
      },
    },
    user: {
      type: User,
      resolve: () => getUser('57b19661ea7338f8003ecf56'),
    },
  },
  subscribe: (input, context) => {
    context.subscribe('add_incoming_req');
  },
});

// ROOT TYPES //

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    user: {
      type: User,
      args: {
        _id: {
          type: GraphQLString,
        },
      },
      resolve: (id, args) => getUser(args._id),
    }
  })
});

// const Mutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: () => ({
//     addTodo: AddTodoMutation,
//     updateTodo: UpdateTodoMutation,
//     removeTodo: RemoveTodoMutation,
//   }),
// });

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    addIncomingReq: AddIncomingReqSubscription
  },
});

export default new GraphQLSchema({
  query: Query,
  // mutation: Mutation,
  subscription: Subscription,
});
