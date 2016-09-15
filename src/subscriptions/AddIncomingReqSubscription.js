import Relay from 'react-relay';
import { Subscription } from 'relay-subscriptions';

class AddIncomingReqSubscription extends Subscription {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
        _id
      }
    `,
  };

  getSubscription() {
    console.log('getSubscription()');
    return Relay.QL`
      subscription {
        addIncomingReq(input: $input) {
          incomingReqEdge {
            __typename
            node {
              id
              _id
              type
              userId
              messageText
            }
          }
          user {
            id
            _id
          }
        }
      }
    `; // AppSidebar/ App
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.user.id,
      connectionName: 'incomingReqs',
      edgeName: 'incomingReqEdge',
      rangeBehaviors: () => 'append',
    }];
  }

  getVariables() {
    return {};
  }
}

export default AddIncomingReqSubscription;
