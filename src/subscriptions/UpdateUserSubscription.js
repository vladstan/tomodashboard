import Relay from 'react-relay';
import { Subscription } from 'relay-subscriptions';

class UpdateUserSubscription extends Subscription {
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
        updateUser(input: $input) {
          user {
            lastReadWatermark
            lastDeliveredWatermark
          }
        }
      }
    `; // AppSidebar/ App
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      },
    }];
  }

  getVariables() {
    return {
      userId: this.props.user._id,
    };
  }
}

export default UpdateUserSubscription;
