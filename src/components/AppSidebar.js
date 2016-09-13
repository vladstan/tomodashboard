import React from 'react';
import Relay from 'react-relay';
import RelaySubscriptions from 'relay-subscriptions';

import {
  Sidebar,
  SidebarControls,
  SidebarControlBtn,
  Grid,
  Row,
  Col,
  Progress,
  Icon,
} from '@sketchpixy/rubix';

import IncomingReqSidebar from '../components/IncomingReqSidebar';
import ActiveChatsSidebar from '../components/ActiveChatsSidebar';
import BroadcastingSidebar from '../components/BroadcastingSidebar';
import StatsSidebar from '../components/StatsSidebar';

import AddIncomingReqSubscription from '../subscriptions/AddIncomingReqSubscription';

import { withRouter } from 'react-router';

@withRouter
class AppSidebar extends React.Component {
  render() {
    return (
      <div id='sidebar'>
        <div id='avatar'>
          <Grid>
            <Row className='fg-white'>
              <Col xs={4} collapseRight>
                <img src='/imgs/app/avatars/avatar17.png' width='40' height='40' />
              </Col>
              <Col xs={8} collapseLeft id='avatar-col'>
                <div style={{top: 23, fontSize: 16, lineHeight: 1, position: 'relative'}}>Agent Smith</div>
                <div>
                  <Progress id='demo-progress' value={30} color='#ffffff'/>
                  <a href='#'>
                    <Icon id='demo-icon' bundle='fontello' glyph='lock-5' />
                  </a>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
        <SidebarControls>
          <SidebarControlBtn bundle='fontello' glyph='bell-5' sidebar={0} />
          <SidebarControlBtn bundle='fontello' glyph='flag-1' sidebar={1} />
          <SidebarControlBtn bundle='fontello' glyph='chat-1' sidebar={2} />
          <SidebarControlBtn bundle='fontello' glyph='chart-pie-2' sidebar={3} />
        </SidebarControls>
        <div id='sidebar-container'>
          <Sidebar sidebar={0}>
            <IncomingReqSidebar />
          </Sidebar>
          <Sidebar sidebar={1}>
            <ActiveChatsSidebar />
          </Sidebar>
          <Sidebar sidebar={2}>
            <BroadcastingSidebar />
          </Sidebar>
          <Sidebar sidebar={3}>
            <StatsSidebar />
          </Sidebar>
        </div>
      </div>
    );
  }
}

// const AppSidebarContainer = RelaySubscriptions.createContainer(AppSidebar, {
//   fragments: {
//     incomingReqs: () => Relay.QL`
//       fragment on IncomingReq {
//         id
//         _id
//         type
//         userId
//         messageText
//       }
//     `
//   },
//   subscriptions: [
//     ({ incomingReq }) => new AddIncomingReqSubscription({ incomingReq }),
//   ],
// });

// export default AppSidebarContainer;
export default AppSidebar;
