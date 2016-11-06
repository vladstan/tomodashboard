import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLString,
  // GraphQLList,
  GraphQLInt,
  // GraphQLID
} from 'graphql';

import {
  // toGlobalId,
  fromGlobalId,
  globalIdField,
  offsetToCursor,
  connectionArgs,
  nodeDefinitions,
  connectionFromArray,
  connectionDefinitions,
  connectionFromPromisedArray,
  mutationWithClientMutationId,
  // cursorForObjectInConnection,
} from 'graphql-relay';

import {
  getUser,
  getAgent,
  getProfile,
  getProfileOfUser,
  getSessionOfUser,
  getIncomingReqs,
  getIncomingReq,
  getMessagesForUser,
  getUsersForAgent,
  getMessage,
  getSummary,
  switchBotAgent,
  updateStripeDetails,
  insertAndGetSummary,
} from './database';

import {
  sendMessage,
} from './okclaire';

import { getWithType, isType } from '@sketchpixy/rubix/lib/node/relay-utils';
import { subscriptionWithClientId } from 'graphql-relay-subscription';
import Stripe from 'stripe';

import jsonwebtoken from 'jsonwebtoken';

const jwtSecret = '23rfqwdf32wqda';
const stripeService = new Stripe(process.env.STRIPE_SECRET_KEY);

// INTERFACE //

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    let { type, _id } = fromGlobalId(globalId);

    if (type === 'User') {
      return getWithType(getUser(_id), 'User');
    } else if (type === 'Agent') {
      return getWithType(getAgent(_id), 'Agent');
    } else if (type === 'Summary') {
      return getWithType(getSummary(_id), 'Summary');
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
    } else if (isType(obj, 'Agent')) {
      return Agent;
    } else if (isType(obj, 'Summary')) {
      return Summary;
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

const ProfilePrefs = new GraphQLObjectType({
  name: 'ProfilePrefs',
  fields: {
    id: globalIdField('ProfilePrefs'),
    home_airport: {
      type: GraphQLString,
      resolve: (doc) => doc.home_airport,
    },
    accommodation: {
      type: GraphQLString,
      resolve: (doc) => doc.accommodation,
    },
    accommodation_budget: {
      type: GraphQLString,
      resolve: (doc) => doc.accommodation_budget,
    },
    accommodation_budget_currency: {
      type: GraphQLString,
      resolve: (doc) => doc.accommodation_budget_currency,
    },
    flight_cabin: {
      type: GraphQLString,
      resolve: (doc) => doc.flight_cabin,
    },
    flight_seat: {
      type: GraphQLString,
      resolve: (doc) => doc.flight_seat,
    },
    next_trip_type: {
      type: GraphQLString,
      resolve: (doc) => doc.next_trip_type,
    },
    next_trip_destination: {
      type: GraphQLString,
      resolve: (doc) => doc.next_trip_destination,
    },
    next_trip_time: {
      type: GraphQLString,
      resolve: (doc) => doc.next_trip_time,
    },
    next_trip_purpose: {
      type: GraphQLString,
      resolve: (doc) => doc.next_trip_purpose,
    },
    next_trip_extra: {
      type: GraphQLString,
      resolve: (doc) => doc.next_trip_extra,
    },
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
      resolve: (doc) => doc.firstName + ' ' + doc.lastName,
    },
    firstName: {
      type: GraphQLString,
      resolve: (doc) => doc.firstName,
    },
    lastName: {
      type: GraphQLString,
      resolve: (doc) => doc.lastName,
    },
    pictureUrl: {
      type: GraphQLString,
      resolve: (doc) => doc.pictureUrl,
    },
    gender: {
      type: GraphQLString,
      resolve: (doc) => doc.gender,
    },
    locale: {
      type: GraphQLString,
      resolve: (doc) => doc.locale,
    },
    timezone: {
      type: GraphQLInt,
      resolve: (doc) => doc.timezone,
    },
    prefs: {
      type: ProfilePrefs,
      resolve: (doc) => doc.prefs,
    }
  }),
  interfaces: [nodeInterface],
});

const StripeCredentials = new GraphQLObjectType({
  name: 'StripeCredentials',
  fields: () => ({
    id: globalIdField('StripeCredentials'),
    customerId: {
      type: GraphQLString,
      resolve: (doc) => doc.customerId,
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
      resolve: (doc) => getProfileOfUser(doc._id),
    },
    messages: {
      type: MessagesConnection,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromPromisedArray(getMessagesForUser(doc._id), args),
    },
    botMuted: {
      type: GraphQLBoolean,
      resolve: (doc) => !!doc.botMuted
    },
    stripe: {
      type: StripeCredentials,
      resolve: (doc) => doc.stripe,
    },
  }),
  interfaces: [nodeInterface],
});

const Agent = new GraphQLObjectType({
  name: 'Agent',
  fields: () => ({
    id: globalIdField('Agent', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    fbUserId: {
      type: GraphQLString,
      resolve: (doc) => doc.fbUserId,
    },
    name: {
      type: GraphQLString,
      resolve: (doc) => doc.name,
    },
    email: {
      type: GraphQLString,
      resolve: (doc) => doc.email,
    },
    pictureUrl: {
      type: GraphQLString,
      resolve: (doc) => doc.pictureUrl,
    },
    fbAccessToken: {
      type: GraphQLString,
      resolve: (doc) => doc.fbAccessToken,
    },
    incomingReqs: {
      type: IncomingReqsConnection,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromPromisedArray(getIncomingReqs(), args),
    },
    users: {
      type: UsersConnection,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromPromisedArray(getUsersForAgent(doc._id), args),
    },
  }),
  interfaces: [nodeInterface],
});

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

const Summary = new GraphQLObjectType({
  name: 'Summary',
  fields: () => ({
    id: globalIdField('Summary', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    fields: {
      type: SummaryFieldsConnection,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromArray(doc.fields, args),
    },
    total: {
      type: GraphQLInt,
      resolve: (doc) => {
        const totalPrice = doc.fields.reduce((acc, f) => acc + f.price, 0);
        const totalFee = doc.fields.reduce((acc, f) => acc + f.segments * f.segmentPrice, 0);
        return totalPrice + totalFee;
      },
    },
    user: {
      type: User,
      resolve: (doc) => getUser(doc.userId),
    },
    agent: {
      type: Agent,
      resolve: (doc) => getAgent(doc.agentId),
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

const {
  connectionType: UsersConnection,
  edgeType: UserEdge
} = connectionDefinitions({
  name: 'users',
  nodeType: User
});

const {
  connectionType: SummaryFieldsConnection,
  edgeType: SummaryFieldEdge
} = connectionDefinitions({
  name: 'summaryFields',
  nodeType: SummaryField
});

// MUTATIONS //

const SendMessageMutation = mutationWithClientMutationId({
  name: 'SendMessage',
  inputFields: {
    type: { type: new GraphQLNonNull(GraphQLString) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    senderId: { type: new GraphQLNonNull(GraphQLString) },
    receiverId: { type: new GraphQLNonNull(GraphQLString) },
    receiverFacebookId: { type: new GraphQLNonNull(GraphQLString) },
    senderType: { type: new GraphQLNonNull(GraphQLString) },
    receiverType: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    messageEdge: {
      type: MessageEdge,
      resolve: async (doc) => {
        const messages = await getMessagesForUser(doc.userId);
        console.log('messages vs doc', '\n\n\n', messages, '\n\n\n', doc);
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
  mutateAndGetPayload: (props) =>
    getSessionOfUser(props.userId)
      .then((session) => {
        return sendMessage({
          type: props.type,
          text: props.text,
          senderId: props.senderId,
          receiverId: props.receiverId,
          receiverFacebookId: props.receiverFacebookId,
          senderType: props.senderType,
          receiverType: props.receiverType,
          sessionId: session._id,
        }).catch(::console.error);
      })
      .catch(::console.error),
});

const SwitchBotAgentMutation = mutationWithClientMutationId({
  name: 'SwitchBotAgent',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    botMuted: { type: new GraphQLNonNull(GraphQLBoolean) },
    agentName: { type: new GraphQLNonNull(GraphQLString) },
    userFbId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: User,
      resolve: (payload) => getUser(payload.userId),
    },
  },
  mutateAndGetPayload: async (props) => {
    try {
      await switchBotAgent(props.userId, props.botMuted);
      await getSessionOfUser(props.userId)
        .then((session) => {
          let textMessage;

          if (props.botMuted) {
            textMessage = "You're now talking to " + props.agentName;
          } else {
            textMessage = "You're now talking to Yago";
          }

          return sendMessage({
            type: 'text',
            text: textMessage,
            senderId: '00agent00',
            receiverId: props.userId,
            receiverFacebookId: props.userFbId,
            senderType: 'bot',
            receiverType: 'user',
            sessionId: session._id,
          });
        });
    } catch (ex) {
      console.error('switch agent mutateAndGetPayload error:', ex);
    }

    return {
      userId: props.userId
    };
  },
});

const UpdateStripeDetailsMutation = mutationWithClientMutationId({
  name: 'UpdateStripeDetails',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    token: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: User,
      resolve: (payload) => getUser(payload.userId),
    },
  },
  mutateAndGetPayload: async (props) => {
    try {
      const token = JSON.parse(props.token);
      const customer = await stripeService.customers.create({
        source: token.id,
        description: props.name,
        email: token.email,
        metadata: {
          userId: props.userId,
        },
      });

      console.log('we have the customer!', customer);

      const stripe = {
        customerId: customer.id,
      };

      // also add to our user in mongodb: token.email
      const upd = await updateStripeDetails(props.userId, stripe);

      console.log('we trapped the customer in our db =', upd);
      console.log('charging mr customer...');

      const charge = await stripeService.charges.create({
        amount: 5000,
        currency: 'usd',
        customer: customer.id,
      });

      console.log('charge=', charge);
    } catch (ex) {
      console.error(ex);
    }

    return {
      userId: props.userId
    };
  },
});

const GetSummaryLinkMutation = mutationWithClientMutationId({
  name: 'GetSummaryLink',
  inputFields: {
    summary: { type: new GraphQLNonNull(GraphQLString) },
    agentId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    link: {
      type: GraphQLString,
      resolve: (payload) => payload.link,
    },
  },
  mutateAndGetPayload: async (props) => {
    try {
      const summary = JSON.parse(props.summary);
      if (!Array.isArray(summary.fields)) {
        summary.fields = Object.keys(summary.fields)
          .map(key => summary.fields[key]);
      }
      // console.log('parsed summary=', summary, 'FROM', props.summary);
      summary.agentId = props.agentId;
      summary.userId = props.userId;
      const summaryDoc = await insertAndGetSummary(summary);
      return {
        link: summaryDoc._id, // link is actually ID
      };
    } catch (ex) {
      console.error(ex);
    }

    return {};
  },
});

// SUBSCRIPTIONS //

const AddIncomingReqSubscription = subscriptionWithClientId({
  name: 'AddIncomingReqSubscription',
  inputFields: {
    agentId: { type: new GraphQLNonNull(GraphQLString) },
  },
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
  },
  subscribe: (input, context) => {
    context.subscribe('add_incoming_req'); // use agentId
  },
});

const UpdateIncomingReqSubscription = subscriptionWithClientId({
  name: 'UpdateIncomingReqSubscription',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    incomingReq: {
      type: IncomingReq,
      resolve: (doc) => doc,
    },
  },
  subscribe: (input, context) => {
    context.subscribe('update_incoming_req:' + input.userId);
  },
});

const AddMessageSubscription = subscriptionWithClientId({
  name: 'AddMessageSubscription',
  inputFields: {
    userId: { type: GraphQLString },
  },
  outputFields: {
    message: {
      type: Message,
      resolve: (doc) => doc,
    },
    messageEdge: {
      type: MessageEdge,
      resolve: async (doc) => {
        const userId = doc.senderType === 'user' ? doc.senderId : doc.receiverId;
        const messages = await getMessagesForUser(userId);
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
      resolve: (doc) => {
        const userId = doc.senderType === 'user' ? doc.senderId : doc.receiverId;
        return getUser(userId);
      },
    },
  },
  subscribe: (input, context) => {
    console.log('subscribing to:', `add_message:${input.userId}`);
    context.subscribe(`add_message:${input.userId}`);
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
    },
    agent: {
      type: Agent,
      args: {
        token: {
          type: GraphQLString,
        },
      },
      resolve: async (id, args) => {
        try {
          const payload = jsonwebtoken.verify(args.token, jwtSecret);
          return await getAgent(payload._id);
        } catch (ex) {
          console.error('getAgent', ex);
        }
      },
    },
    summary: {
      type: Summary,
      args: {
        _id: {
          type: GraphQLString,
        },
      },
      resolve: (id, args) => getSummary(args._id),
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    sendMessage: SendMessageMutation,
    switchBotAgent: SwitchBotAgentMutation,
    updateStripeDetails: UpdateStripeDetailsMutation,
    getSummaryLink: GetSummaryLinkMutation,
  }),
});

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    addIncomingReq: AddIncomingReqSubscription,
    updateIncomingReq: UpdateIncomingReqSubscription,
    addMessage: AddMessageSubscription,
  },
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
});
