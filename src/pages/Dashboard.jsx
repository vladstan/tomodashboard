import React from 'react';
import Relay from 'react-relay';

import {
  Grid,
  Row,
  Col,
  MainContainer,
} from '@sketchpixy/rubix';

import AgentSidebar from '../components/agent/AgentSidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

class Dashboard extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    agent: React.PropTypes.object.isRequired,
  }

  render() {
    return (
      <MainContainer>
        <AgentSidebar agent={this.props.agent} />
        <Header />
        <div id='body'>
          <Grid>
            <Row>
              <Col>
                {this.props.children}
              </Col>
            </Row>
          </Grid>
        </div>
        <Footer />
      </MainContainer>
    );
  }

}

const DashboardContainer = Relay.createContainer(Dashboard, {
  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        name
        ${AgentSidebar.getFragment('agent')}
      }
    `,
  },
});

export default DashboardContainer;
