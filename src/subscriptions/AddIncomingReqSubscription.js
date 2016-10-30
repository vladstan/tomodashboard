import Relay from 'react-relay';
import { Subscription } from 'relay-subscriptions';

class AddIncomingReqSubscription extends Subscription {
  static fragments = {
    agent: () => Relay.QL`
      fragment on Agent {
        id
        _id
      }
    `,
  };

  getSubscription() {
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
        }
      }
    `; // AppSidebar/ App
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'agent',
      parentID: this.props.agent.id,
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
