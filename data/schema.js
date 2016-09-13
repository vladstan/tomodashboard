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
  // offsetToCursor,
  // connectionArgs,
  nodeDefinitions,
  // connectionFromArray,
  connectionDefinitions,
  // connectionFromPromisedArray,
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

/* Interface */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    let { type, id } = fromGlobalId(globalId);

    if (type === 'User') {
      return getWithType(getUser(id), 'User');
    } else if (type === 'Profile') {
      return getWithType(getProfile(id), 'Profile');
    } else {
      return null;
    }
  },
  (obj) => {
    if (isType(obj, 'User')) {
      return userType;
    } else if (isType(obj, 'Profile')) {
      return profileType;
    } else {
      return null;
    }
  }
);

/* Basic Types */
const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: globalIdField('Profile', (profile) => profile._id),
    _id: {
      type: GraphQLString,
      resolve: (profile) => profile._id,
    },
    userId: {
      type: GraphQLString,
      resolve: (profile) => profile.userId,
    }
  }),
  interfaces: [nodeInterface],
});

// const {
//   connectionType: profileConnection,
//   edgeType: profileEdge
// } = connectionDefinitions({
//   name: 'Profile',
//   nodeType: profileType
// });

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User', (user) => user._id),
    _id: {
      type: GraphQLString,
      resolve: (user) => user._id,
    },
    facebookId: {
      type: GraphQLString,
      resolve: (user) => user.facebookId,
    },
    profile: {
      type: profileType,
      resolve: (user) => getProfileOfUser(user._id)
    }
  }),
  interfaces: [nodeInterface],
});

const incomingReqType = new GraphQLObjectType({
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

// /* Mutations */
// const AddIncomingReqMutation = mutationWithClientMutationId({
//   name: 'AddTodo',
//   inputFields: {
//     todo: { type: new GraphQLNonNull(GraphQLString) },
//   },
//   outputFields: {
//     todoEdge: {
//       type: todoEdge,
//       resolve: ({ _id, todo, completed }) => {
//         return getTodos().then((todos) => {
//           /**
//             We make use of offsetToCursor to figure out the todo item's offset
//             instead of cursorForObjectInConnection. This is because
//             cursorForObjectInConnection uses indexOf to do a shallow scan (
//             instead of a deep scan) of items. We manually scan the todo list
//             to find the location todo item and then use offsetToCursor to get
//             the Relay equivalent base64 encoded representation of the offset.
//           */
//           var offset = 0;
//
//           // figure out where the todo item is located in the list of todos
//           for (var i = 0; i < todos.length; i++) {
//             if (todos[i]._id.equals(_id)) {
//               // found the offset
//               offset = i;
//               break;
//             }
//           }
//
//           return {
//             cursor: offsetToCursor(offset),
//             node: { _id, todo, completed },
//           }
//         });
//       }
//     },
//     user: {
//       type: userType,
//       resolve: () => getUser(),
//     },
//     error: {
//       type: GraphQLString
//     }
//   },
//   mutateAndGetPayload: ({todo}) => addTodo(todo)
// });
//
// const UpdateTodoMutation = mutationWithClientMutationId({
//   name: 'UpdateTodo',
//   inputFields: {
//     id: { type: new GraphQLNonNull(GraphQLID) },
//     todo: { type: new GraphQLNonNull(GraphQLString) },
//     completed: { type: new GraphQLNonNull(GraphQLBoolean) },
//   },
//   outputFields: {
//     todo: {
//       type: todoType,
//       resolve: ({ todo }) => getTodo(todo)
//     },
//     user: {
//       type: userType,
//       resolve: () => getUser(),
//     },
//   },
//   mutateAndGetPayload: ({ id, todo, completed }) =>
//                           updateTodo(fromGlobalId(id).id, todo, completed)
// });
//
// const RemoveTodoMutation = mutationWithClientMutationId({
//   name: 'RemoveTodo',
//   inputFields: {
//     id: { type: new GraphQLNonNull(GraphQLID) },
//   },
//   outputFields: {
//     todoIdToBeDeleted: {
//       type: GraphQLID,
//       resolve: ({ todo }) => toGlobalId('Todo', todo),
//     },
//     user: {
//       type: userType,
//       resolve: () => getUser(),
//     },
//   },
//   mutateAndGetPayload: ({ id }) => removeTodo(fromGlobalId(id).id)
// });

/* Query Type */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    user: {
      type: userType,
      args: {
        id: {
          type: GraphQLString,
        },
      },
      resolve: (id, args) => getUser(args.id),
    }
  })
});

/* Mutation Type */
// const mutationType = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: () => ({
//     addTodo: AddTodoMutation,
//     updateTodo: UpdateTodoMutation,
//     removeTodo: RemoveTodoMutation,
//   }),
// });

const {
  // connectionType: incomingReqConnection,
  edgeType: incomingReqEdge
} = connectionDefinitions({
  name: 'IncomingReq',
  nodeType: incomingReqType
});

const addIncomingReqSubscription = subscriptionWithClientId({
  name: 'AddIncomingReqSubscription',
  outputFields: {
    incomingReq: {
      type: incomingReqType,
      resolve: (req) => req,
    },
    incomingReqEdge: {
      type: incomingReqEdge,
      resolve: (req) => ({
        cursor: cursorForObjectInConnection(getIncomingReqs(), getIncomingReq(req._id)),
        node: req,
      }),
    },
  },
  subscribe: (input, context) => {
    context.subscribe('add_incoming_req');
  },
});

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    addIncomingReqSubscription
  },
});

export default new GraphQLSchema({
  query: queryType,
  subscription: Subscription,
  // mutation: mutationType
});
