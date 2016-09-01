import Relay from 'react-relay';
import { Subscription } from 'relay-subscriptions';

import Widget from '../components/Widget';

class WidgetSubscription extends Subscription {
  static fragments = {
    widget: () => Relay.QL`
      fragment on Widget {
        id
      }
    `,
  };

  getSubscription() {
    return Relay.QL`
      subscription {
        updateWidget(input: $input) {
          widget {
            ${Widget.getFragment('widget')}
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        widget: this.props.widget.id,
      },
    }];
  }

  getVariables() {
    return {
      id: this.props.widget.id,
    };
  }
}

export default WidgetSubscription;
