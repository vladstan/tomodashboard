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

class IncomingReqSidebarComponent extends React.Component {

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12} collapseLeft collapseRight>
              { this.props.reqs.reverse().map((req) => (
                <TimelineView className='border-black50 tl-blue' key={req.id}>
                  <TimelineItem>
                    <TimelineHeader>
                      <TimelineAvatar src='/imgs/app/avatars/avatar5.png' className='border-blue' />
                      <TimelineTitle>
                        Jordyn Ouellet
                      </TimelineTitle>
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
                            <Link to={'/chat/' + req.userId}>
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

export default IncomingReqSidebarComponent;
