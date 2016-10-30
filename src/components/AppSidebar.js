import React from 'react';

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

// import { withRouter } from 'react-router';

// @withRouter
class AppSidebar extends React.Component {
  render() {
    const agent = this.props.agent;
    if (!agent) {
      console.error('no agent data in appsidebar :p'); // save time in case it happens again
    }
    const reqs = agent.incomingReqs.edges.map(e => e.node);

    return (
      <div id='sidebar'>
        <div id='avatar'>
          <Grid>
            <Row className='fg-white'>
              <Col xs={4} collapseRight>
                <img src={agent.pictureUrl} width='40' height='40' />
              </Col>
              <Col xs={8} collapseLeft id='avatar-col'>
                <div style={{top: 23, fontSize: 16, lineHeight: 1, position: 'relative'}}>{agent.name}</div>
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
            <IncomingReqSidebar reqs={reqs} />
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

export default AppSidebar;
