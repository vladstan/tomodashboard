import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import User from '../types/User';

import { subscriptionWithClientId } from 'graphql-relay-subscription';

const UpdateUserSubscription = subscriptionWithClientId({
  name: 'UpdateUserSubscription',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: User,
      resolve: (doc) => doc,
    },
  },
  subscribe: (input, context) => {
    context.subscribe('update_user:' + input.userId);
  },
});

export default UpdateUserSubscription;
