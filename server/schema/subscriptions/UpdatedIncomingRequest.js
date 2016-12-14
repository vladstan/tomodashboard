const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const {subscriptionWithClientId} = require('graphql-relay-subscription');

const UpdatedIncomingRequestSubscription = subscriptionWithClientId({
  name: 'UpdatedIncomingRequestSubscription',
  inputFields: {
    userId: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: () => ({
    incomingRequest: {
      type: require('../types/IncomingRequest'),
      resolve: (doc) => doc,
    },
  }),
  subscribe: (input, context) => {
    context.subscribe('updated:incoming_request:' + input.userId);
  },
});

module.exports = UpdatedIncomingRequestSubscription;
