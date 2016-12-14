import Relay from 'react-relay';
import { Subscription } from 'relay-subscriptions';

const IncomingRequest = require('../components/agent/IncomingRequest');

class UpdatedIncomingRequestSubscription extends Subscription {

  static fragments = {
    incomingRequest: () => Relay.QL`
      fragment on IncomingRequest {
        id
        userId
      }
    `,
  };

  getSubscription() {
    return Relay.QL`
      subscription {
        updatedIncomingRequest(input: $input) {
          incomingRequest {
            ${IncomingRequest.getFragment('incomingRequest')}
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        incomingRequest: this.props.incomingRequest.id,
      },
    }];
  }

  getVariables() {
    return {
      userId: this.props.incomingRequest.userId,
    };
  }

}

export default UpdatedIncomingRequestSubscription;
