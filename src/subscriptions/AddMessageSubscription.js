import Relay from 'react-relay';
import { Subscription } from 'relay-subscriptions';

class AddMessageSubscription extends Subscription {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
        _id
      }
    `,
  };

  getSubscription() {
    return Relay.QL`
      subscription {
        addMessage(input: $input) {
          messageEdge {
            __typename
            node {
              id
              _id
              type
              text
              senderId
              receiverId
              senderType
              receiverType
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
      connectionName: 'messages',
      edgeName: 'messageEdge',
      rangeBehaviors: () => 'append',
    }];
  }

  getVariables() {
    return {
      userId: this.props.user._id,
    };
  }
}

export default AddMessageSubscription;
