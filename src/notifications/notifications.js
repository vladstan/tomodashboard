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

export default class NotificationsComponent extends React.Component {

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12} collapseLeft collapseRight>
              <TimelineView className='border-black50 tl-blue'>
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
                          <div><small>I want to rent a house with a pool in Felantrix.</small></div>
                        </div>
                        <br/>
                        <div className='text-center'>
                          <Button xs outlined bsStyle='darkgreen45'>
                            Chat
                          </Button>{' '}
                        </div>
                      </li>
                    </ul>
                  </TimelineBody>
                </TimelineItem>
              </TimelineView>
              <TimelineView className='border-black50 tl-green'>
                <TimelineItem>
                  <TimelineHeader>
                    <TimelineAvatar src='/imgs/app/avatars/avatar7.png' className='border-green' />
                    <TimelineTitle>
                      Toby King
                    </TimelineTitle>
                  </TimelineHeader>
                  <TimelineBody>
                    <ul>
                      <li>
                        <div className='fg-lightgray'><small><strong>Aug 9, 2014</strong></small></div>
                        <div>
                          <small>Can you tell me what public transport I can get from here to the airport?</small>
                        </div>
                        <br/>
                        <img border='0' src='/imgs/app/staticmap.png' alt='Points of Interest in Lower Manhattan' />
                        <br/><br/>
                        <div className='text-center'>
                          <Button xs outlined bsStyle='darkgreen45'>
                            Chat
                          </Button>{' '}
                        </div>
                      </li>
                    </ul>
                  </TimelineBody>
                </TimelineItem>
              </TimelineView>
              <TimelineView className='border-black50 tl-yellow'>
                <TimelineItem>
                  <TimelineHeader>
                    <TimelineAvatar src='/imgs/app/avatars/avatar10.png' className='border-yellow' />
                    <TimelineTitle>
                      Angelina Mills
                    </TimelineTitle>
                  </TimelineHeader>
                  <TimelineBody>
                    <ul>
                      <li>
                        <div className='fg-lightgray'><small><strong>Aug 8, 2014</strong></small></div>
                        <div>
                          <small>Where I can find some gogles for diving?</small>
                        </div>
                        <br/>
                        <div className='text-center'>
                          <Button xs outlined bsStyle='darkgreen45'>
                            Chat
                          </Button>{' '}
                        </div>
                      </li>
                    </ul>
                  </TimelineBody>
                </TimelineItem>
              </TimelineView>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
