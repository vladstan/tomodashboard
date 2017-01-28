const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const User = require('../types/User');

const {subscriptionWithClientId} = require('graphql-relay-subscription');

const UpdateUserSubscription = subscriptionWithClientId({
  name: 'UpdateUserSubscription',
  inputFields: {
    userId: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: () => ({
    user: {
      type: User,
      resolve: (doc) => doc,
    },
  },
  subscribe: (input, context) => {
    context.subscribe('update_user:' + input.userId);
  },
});

module.exports = UpdateUserSubscription;
