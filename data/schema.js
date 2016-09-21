import {
  GraphQLObjectType,
  GraphQLNonNull,
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
  mutationWithClientMutationId,
  // cursorForObjectInConnection,
} from 'graphql-relay';

import {
  getUser,
  getProfile,
  getProfileOfUser,
  getIncomingReqs,
  getIncomingReq,
  getMessagesForUser,
  getMessage,
} from './database';

import {
  sendMessage,
} from './okclaire';

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
    } else if (type === 'Message') {
      return getWithType(getMessage(_id), 'Message');
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
    } else if (isType(obj, 'Message')) {
      return Message;
    } else {
      return null;
    }
  }
);

// TYPES //

const IncomingReq = new GraphQLObjectType({
  name: 'IncomingReq',
  fields: {
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
    // createdAt: {
    //   type: GraphQLString,
    //   resolve: (doc) => doc.type,
    // },
  },
  interfaces: [nodeInterface],
});

const Message = new GraphQLObjectType({
  name: 'Message',
  fields: {
    id: globalIdField('Message', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    type: {
      type: GraphQLString,
      resolve: (doc) => doc.type,
    },
    text: {
      type: GraphQLString,
      resolve: (doc) => doc.text,
    },
    senderId: {
      type: GraphQLString,
      resolve: (doc) => doc.senderId,
    },
    receiverId: {
      type: GraphQLString,
      resolve: (doc) => doc.receiverId,
    },
    senderType: {
      type: GraphQLString,
      resolve: (doc) => doc.senderType,
    },
    receiverType: {
      type: GraphQLString,
      resolve: (doc) => doc.receiverType,
    },
    // createdAt: {
    //   type: GraphQLString,
    //   resolve: (doc) => doc.type,
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
    messages: {
      type: MessagesConnection,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromPromisedArray(getMessagesForUser(doc._id), args),
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

const {
  connectionType: MessagesConnection,
  edgeType: MessageEdge
} = connectionDefinitions({
  name: 'messages',
  nodeType: Message
});

// MUTATIONS //


const SendMessageMutation = mutationWithClientMutationId({
  name: 'SendMessage',
  inputFields: {
    type: { type: new GraphQLNonNull(GraphQLString) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    senderId: { type: new GraphQLNonNull(GraphQLString) },
    receiverId: { type: new GraphQLNonNull(GraphQLString) },
    senderType: { type: new GraphQLNonNull(GraphQLString) },
    receiverType: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    messageEdge: {
      type: MessageEdge,
      resolve: async (doc) => {
        const messages = await getMessagesForUser(doc.userId);
        const offset = messages.length - 1;
        const cursor = offsetToCursor(offset);

        return {
          cursor: cursor,
          node: doc,
        };
      },
    },
    user: {
      type: User,
      resolve: (doc) => getUser(doc.userId),
    },
  },
  mutateAndGetPayload: (props) => sendMessage(props),
});

// SUBSCRIPTIONS //

const AddIncomingReqSubscription = subscriptionWithClientId({
  name: 'AddIncomingReqSubscription',
  outputFields: {
    incomingReq: {
      type: IncomingReq,
      resolve: (doc) => doc,
    },
    incomingReqEdge: {
      type: IncomingReqEdge,
      resolve: async (doc) => {
        const ireqs = await getIncomingReqs();
        // const ireq = await getIncomingReq(req._id);

        // console.log('ireqs', ireqs);
        // console.log('ireq', ireq);
        //
        // const crs = cursorForObjectInConnection(ireqs, ireq);
        // console.log('ireqs.indexOf(ireq)', ireqs.indexOf(ireq));
        // console.log('crs', crs);

        const offset = ireqs.length - 1;
        const cursor = offsetToCursor(offset);
        console.log('cursor', cursor, offset);

        return {
          cursor: cursor,
          node: doc,
        };
      },
    },
    user: {
      type: User,
      resolve: (doc) => getUser(doc.userId),
    },
  },
  subscribe: (input, context) => {
    context.subscribe('add_incoming_req');
  },
});

const AddMessageSubscription = subscriptionWithClientId({
  name: 'AddMessageSubscription',
  outputFields: {
    message: {
      type: Message,
      resolve: (doc) => doc,
    },
    messageEdge: {
      type: MessageEdge,
      resolve: async (doc) => {
        const messages = await getMessagesForUser(doc.userId);
        const offset = messages.length - 1;
        const cursor = offsetToCursor(offset);

        return {
          cursor: cursor,
          node: doc,
        };
      },
    },
    user: {
      type: User,
      resolve: (doc) => getUser(doc.userId),
    },
  },
  subscribe: (input, context) => {
    context.subscribe('add_message');
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

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    sendMessage: SendMessageMutation,
  }),
});

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    addIncomingReq: AddIncomingReqSubscription,
    addMessage: AddMessageSubscription,
  },
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
});
