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

class IncomingReqSidebar extends React.Component {

  render() {
    // console.log('IncomingReqSidebar', this.props);
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12} collapseLeft collapseRight>
              { this.props.reqs.reverse().map((req) => (
                <TimelineView className='border-black50 tl-blue' key={req.id}>
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
                                Chat
                              </Button>{' '}
                            </Link>
                            <Button xs outlined bsStyle='red'>
                              Send to Dev
                            </Button>
                          </div>
                        </li>
                      </ul>
                    </TimelineBody>
                  </TimelineItem>
                </TimelineView>
              )) }
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default IncomingReqSidebar;
