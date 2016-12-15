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
} from '@sketchpixy/rubix';

import ActiveChatsSidebar from './ActiveChatsSidebar';
import BroadcastingSidebar from './BroadcastingSidebar';
import IncomingRequestsSidebar from './IncomingRequestsSidebar';
import StatsSidebar from './StatsSidebar';

class AgentSidebar extends React.Component {

  static propTypes = {
    agent: React.PropTypes.object.isRequired,
  }

  render() {
    const {name, pictureUrl} = this.props.agent;
    return (
      <div id='sidebar'>
        <div id='avatar'>
          <Grid>
            <Row className='fg-white'>
              <Col xs={4} collapseRight>
                <img src={pictureUrl} width='40' height='40' />
              </Col>
              <Col xs={8} collapseLeft id='avatar-col'>
                <div style={{top: 20, fontSize: 16, lineHeight: 1, position: 'relative'}}>{name}</div>
                <p style={{top: 20, position: 'relative'}}>
                  Travel Mate
                </p>
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
            <IncomingRequestsSidebar agent={this.props.agent} />
          </Sidebar>
          <Sidebar sidebar={1}>
            <ActiveChatsSidebar agent={this.props.agent} />
          </Sidebar>
          <Sidebar sidebar={2}>
            <BroadcastingSidebar />
          </Sidebar>
          <Sidebar sidebar={3}>
            <StatsSidebar agent={this.props.agent} />
          </Sidebar>
        </div>
      </div>
    );
  }

}

const AgentSidebarContainer = RelaySubscriptions.createContainer(AgentSidebar, {
  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        name
        pictureUrl
        ${ActiveChatsSidebar.getFragment('agent')}
        ${IncomingRequestsSidebar.getFragment('agent')}
        ${StatsSidebar.getFragment('agent')}
      }
    `,
  },
});

export default AgentSidebarContainer;
