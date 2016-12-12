import React from 'react';

import {
  Grid,
  Row,
  Col,
  Button,
  TimelineView,
  TimelineItem,
  TimelineBody,
  TimelineHeader,
  TimelineAvatar,
  TimelineTitle,
} from '@sketchpixy/rubix';

import { Link } from 'react-router';
import UpdateIncomingReqSubscription from '../subscriptions/UpdateIncomingReqSubscription';
import RelaySubscriptions from 'relay-subscriptions';

class IncomingReq extends React.Component {

  render() {
    const req = this.props.req;
    return (
      <TimelineView className='border-black50 tl-blue'>
        <TimelineItem>
          <TimelineHeader>
            <TimelineAvatar src={req.user.profile.pictureUrl} className='border-blue' />
            <TimelineTitle>{req.user.profile.name}</TimelineTitle>
          </TimelineHeader>
          <TimelineBody>
            <ul>
              <li>
                <div>
                  <div className='fg-lightgray'><small><strong>Aug 10, 2014</strong></small></div>
                  <div><small>{req.messageText}</small></div>
                </div>
                <br/>
                <div className='text-center'>
                  <Link to={'/dashboard/chat/' + req.userId}>
                    <Button xs outlined bsStyle='darkgreen45'>
                      Start Chatting
                    </Button>{' '}
                  </Link>
                  {/* <Button xs outlined bsStyle='red'>
                    Send to Dev
                  </Button> */}
                </div>
              </li>
            </ul>
          </TimelineBody>
        </TimelineItem>
      </TimelineView>
    );
  }

}

const IncomingReqContainer = RelaySubscriptions.createContainer(IncomingReq, {
  fragments: {},
  subscriptions: [
    // ({req}) => new UpdateIncomingReqSubscription({incomingReq: req}), TODO fix sub
  ],
});

class IncomingReqSidebar extends React.Component {

  render() {
    // console.log('IncomingReqSidebar', this.props.reqs);
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12} collapseLeft collapseRight>
              { this.props.reqs.reverse().map((req) => (
                <IncomingReqContainer req={req} key={req.id} />
              )) }
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

export default IncomingReqSidebar;
