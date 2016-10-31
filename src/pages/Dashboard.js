import React from 'react';

import Relay from 'react-relay';
import RelaySubscriptions from 'relay-subscriptions';
import { withRouter } from 'react-router';

import AddIncomingReqSubscription from '../subscriptions/AddIncomingReqSubscription';
import UpdateIncomingReqSubscription from '../subscriptions/UpdateIncomingReqSubscription';

import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';

import Footer from '../components/Footer';
import Header from '../components/Header';
import AppSidebar from '../components/AppSidebar';

@withRouter
class Dashboard extends React.Component {
  render() {
    // console.log('this.props.agent=', this.props.agent);
    return (
      <MainContainer {...this.props}>
        <AppSidebar agent={this.props.agent} />
        <Header router={this.props.router} />
        <div id='body'>
          <Grid>
            <Row>
              <Col xs={12}>
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

const DashboardContainer = RelaySubscriptions.createContainer(Dashboard, {
  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        id
        _id
        fbUserId
        name
        email
        pictureUrl
        fbAccessToken
        ${AddIncomingReqSubscription.getFragment('agent')}
        incomingReqs(first: 10) {
          edges {
            node {
              id
              _id
              type
              userId
              messageText
              ${UpdateIncomingReqSubscription.getFragment('incomingReq')}
              user {
                profile {
                  name
                  firstName
                  lastName
                  pictureUrl
                }
              }
            }
          }
        }
      }
    `
  },
  subscriptions: [
    ({agent}) => new AddIncomingReqSubscription({agent}),
  ],
});

export default DashboardContainer;
