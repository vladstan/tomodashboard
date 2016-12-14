import React from 'react';
import Relay from 'react-relay';
import RelaySubscriptions from 'relay-subscriptions';
import {Link} from 'react-router';

import {
  Button,
  TimelineView,
  TimelineItem,
  TimelineBody,
  TimelineHeader,
  TimelineAvatar,
  TimelineTitle,
} from '@sketchpixy/rubix';

import UpdatedIncomingRequestSubscription from '../../subscriptions/UpdatedIncomingRequestSubscription';

class IncomingRequest extends React.Component {

  static propTypes = {
    incomingRequest: React.PropTypes.object.isRequired,
  }

  render() {
    const {messageText, user} = this.props.incomingRequest;
    return (
      <TimelineView className='border-black50 tl-blue'>
        <TimelineItem>
          <TimelineHeader>
            <TimelineAvatar src={user.profile.pictureUrl} className='border-blue' />
            <TimelineTitle>{user.profile.name}</TimelineTitle>
          </TimelineHeader>
          <TimelineBody>
            <ul>
              <li>
                <div>
                  <div className='fg-lightgray'><small><strong>Aug 10, 2014</strong></small></div>
                  <div><small>{messageText}</small></div>
                </div>
                <br/>
                <div className='text-center'>
                  <Link to={'/dashboard/chat/' + user._id}>
                    <Button xs outlined bsStyle='darkgreen45'>
                      Start Chatting
                    </Button>
                  </Link>
                </div>
              </li>
            </ul>
          </TimelineBody>
        </TimelineItem>
      </TimelineView>
    );
  }

}

const IncomingRequestContainer = RelaySubscriptions.createContainer(IncomingRequest, {
  fragments: {
    incomingRequest: () => Relay.QL`
      fragment on IncomingRequest {
        messageText
        user {
          _id
          profile {
            name
            pictureUrl
          }
        }
        ${UpdatedIncomingRequestSubscription.getFragment('incomingRequest')}
      }
    `,
  },
  subscriptions: [
    ({incomingRequest}) => new UpdatedIncomingRequestSubscription({incomingRequest}),
  ],
});

export default IncomingRequestContainer;
