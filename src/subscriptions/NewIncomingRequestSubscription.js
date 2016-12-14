import Relay from 'react-relay';
import {Subscription} from 'relay-subscriptions';

const IncomingRequest = require('../components/agent/IncomingRequest');

class NewIncomingRequestSubscription extends Subscription {

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
        newIncomingRequest(input: $input) {
          incomingRequestEdge {
            __typename
            node {
              ${IncomingRequest.getFragment('incomingRequest')}
            }
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'agent',
      parentID: this.props.agent.id,
      connectionName: 'incomingRequests',
      edgeName: 'incomingRequestEdge',
      rangeBehaviors: () => 'append',
    }];
  }

  getVariables() {
    return {
      agentId: this.props.agent._id,
    };
  }

}

export default NewIncomingRequestSubscription;
