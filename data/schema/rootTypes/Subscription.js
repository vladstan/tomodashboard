import {
  GraphQLObjectType,
} from 'graphql';

import AddIncomingReqSubscription from '../subscriptions/AddIncomingReq';
import UpdateIncomingReqSubscription from '../subscriptions/UpdateIncomingReq';
import UpdateUserSubscription from '../subscriptions/UpdateUser';
import AddMessageSubscription from '../subscriptions/AddMessage';

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    addIncomingReq: AddIncomingReqSubscription,
    updateIncomingReq: UpdateIncomingReqSubscription,
    updateUser: UpdateUserSubscription,
    addMessage: AddMessageSubscription,
  },
});

export default Subscription;
