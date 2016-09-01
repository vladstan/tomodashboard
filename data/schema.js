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
  // connectionDefinitions,
  // connectionFromPromisedArray,
  // mutationWithClientMutationId
} from 'graphql-relay';

import {
  getUser,
  getProfile,
  getProfileOfUser,
} from './database';

import { getWithType, isType } from '@sketchpixy/rubix/lib/node/relay-utils';

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
  description: 'A user\'s profile',
  fields: () => ({
    id: globalIdField('Profile', (profile) => profile._id),
    _id: {
      type: GraphQLString,
      description: 'Profile id',
      resolve: (profile) => profile._id,
    },
    userId: {
      type: GraphQLString,
      description: 'The todo text',
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
  description: 'Main User',
  fields: () => ({
    id: globalIdField('User', (user) => user._id),
    _id: {
      type: GraphQLString,
      description: 'User Mongo id',
      resolve: (user) => user._id,
    },
    facebookId: {
      type: GraphQLString,
      description: 'Facebook id',
      resolve: (user) => user.facebookId,
    },
    profile: {
      type: profileType,
      description: 'The profile',
      resolve: (user) => getProfileOfUser(user._id)
    }
  }),
  interfaces: [nodeInterface],
});

// /* Mutations */
// const AddTodoMutation = mutationWithClientMutationId({
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

export default new GraphQLSchema({
  query: queryType,
  // mutation: mutationType
});
