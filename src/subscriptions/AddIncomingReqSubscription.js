import Relay from 'react-relay';
import { Subscription } from 'relay-subscriptions';

import AppSidebar from '../components/AppSidebar';

class AddIncomingReqSubscription extends Subscription {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on IncomingReq {
        id
      }
    `,
  };

  getSubscription() {
    return Relay.QL`
      subscription {
        addIncomingReqSubscription(input: $input) {
          incomingReqEdge {
            __typename
            node {
              ${AppSidebar.getFragment('incomingReqs')}
            }
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      // parentName: 'viewer',
      // parentID: this.props.viewer.id,
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
