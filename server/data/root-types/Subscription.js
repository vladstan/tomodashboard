const {
  GraphQLObjectType,
} = require('graphql');

const AddIncomingReqSubscription = require('../subscriptions/AddIncomingReq');
const UpdateIncomingReqSubscription = require('../subscriptions/UpdateIncomingReq');
const UpdateUserSubscription = require('../subscriptions/UpdateUser');
const AddMessageSubscription = require('../subscriptions/AddMessage');

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    addIncomingReq: AddIncomingReqSubscription,
    updateIncomingReq: UpdateIncomingReqSubscription,
    updateUser: UpdateUserSubscription,
    addMessage: AddMessageSubscription,
  },
});

module.exports = Subscription;
