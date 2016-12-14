const {
  GraphQLObjectType,
} = require('graphql');

const NewIncomingRequestSubscription = require('../subscriptions/NewIncomingRequest');
const UpdatedIncomingRequestSubscription = require('../subscriptions/UpdatedIncomingRequest');
// const UpdateUserSubscription = require('../subscriptions/UpdateUser');
// const AddMessageSubscription = require('../subscriptions/AddMessage');

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    newIncomingRequest: NewIncomingRequestSubscription,
    updatedIncomingRequest: UpdatedIncomingRequestSubscription,
    // updateUser: UpdateUserSubscription,
    // addMessage: AddMessageSubscription,
  },
});

module.exports = Subscription;
