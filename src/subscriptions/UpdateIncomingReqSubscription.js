import Relay from 'react-relay';
import { Subscription } from 'relay-subscriptions';

class UpdateIncomingReqSubscription extends Subscription {
  static fragments = {
    incomingReq: () => Relay.QL`
      fragment on IncomingReq {
        id
        userId
      }
    `,
  };

  getSubscription() {
    return Relay.QL`
      subscription {
        updateIncomingReq(input: $input) {
          incomingReq {
            id
            _id
            type
            userId
            messageText
            user {
              profile {
                name
                firstName
                lastName
                pictureUrl
              }
            }
          }
        }
      }
    `; // AppSidebar/ App
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        incomingReq: this.props.incomingReq.id,
      },
    }];
  }

  getVariables() {
    return {
      userId: this.props.incomingReq.userId,
    };
  }
}

export default UpdateIncomingReqSubscription;
