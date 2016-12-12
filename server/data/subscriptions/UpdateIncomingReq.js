const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const IncomingReq = require('../types/IncomingReq');

const {subscriptionWithClientId} = require('graphql-relay-subscription');

const UpdateIncomingReqSubscription = subscriptionWithClientId({
  name: 'UpdateIncomingReqSubscription',
  inputFields: {
    userId: {type: new GraphQLNonNull(GraphQLString)},
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

module.exports = UpdateIncomingReqSubscription;
