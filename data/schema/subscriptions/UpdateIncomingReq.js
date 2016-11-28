import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import IncomingReq from '../types/IncomingReq';

import { subscriptionWithClientId } from 'graphql-relay-subscription';

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

export default UpdateIncomingReqSubscription;
