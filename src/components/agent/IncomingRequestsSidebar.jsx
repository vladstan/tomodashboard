import React from 'react';
import Relay from 'react-relay';
import RelaySubscriptions from 'relay-subscriptions';

import {
  Grid,
  Row,
  Col,
} from '@sketchpixy/rubix';

const IncomingRequest = require('./IncomingRequest');

const NewIncomingRequestSubscription = require('../../subscriptions/NewIncomingRequestSubscription');

class IncomingRequestsSidebar extends React.Component {

  static propTypes = {
    agent: React.PropTypes.object.isRequired,
  }

  render() {
    const requests = this.props.agent.incomingRequests.edges.map((e) => e.node).reverse();
    return (
      <Grid>
        <Row>
          <Col xs={12} collapseLeft collapseRight>
            {requests.map((req) => <IncomingRequest incomingRequest={req} key={req.id} />)}
          </Col>
        </Row>
      </Grid>
    );
  }

}

const IncomingRequestsSidebarContainer = RelaySubscriptions.createContainer(IncomingRequestsSidebar, {
  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        incomingRequests(first: 100) {
          edges {
            node {
              ${IncomingRequest.getFragment('incomingRequest')}
            }
          }
        }
        ${NewIncomingRequestSubscription.getFragment('agent')}
      }
    `,
  },
  subscriptions: [
    ({agent}) => new NewIncomingRequestSubscription({agent}),
  ],
});

export default IncomingRequestsSidebarContainer;
