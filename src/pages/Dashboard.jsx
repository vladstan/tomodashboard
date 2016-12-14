import React from 'react';
import Relay from 'react-relay';
import RelaySubscriptions from 'relay-subscriptions';
import {routerShape} from 'react-router';

import {
  Grid,
  Row,
  Col,
  MainContainer,
} from '@sketchpixy/rubix';

import AddIncomingReqSubscription from '../subscriptions/AddIncomingReqSubscription';
import UpdateIncomingReqSubscription from '../subscriptions/UpdateIncomingReqSubscription';

import Footer from '../components/Footer';
import Header from '../components/Header';
// import AppSidebar from '../components/AppSidebar';

class Dashboard extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    router: routerShape.isRequired,
  }

  render() {
    return (
      <MainContainer>
        {/* <AppSidebar agent={this.props.agent} /> */}
        <Header router={this.props.router} />
        <Grid>
          <Row>
            <Col>
              {this.props.children}
            </Col>
          </Row>
        </Grid>
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

        lastCreditAmount
        totalPaidTrips
        averagePayPerTrip
        totalUnpaidTrips
        totalUnpaidMoney
        totalPaidMoney

        users(first: 100) {
          edges {
            node {
              id
              _id
              profile {
                name
                firstName
                lastName
                pictureUrl
              }
            }
          }
        }

        incomingReqs(first: 100) {
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
    `,
  },
  subscriptions: [
    // ({agent}) => new AddIncomingReqSubscription({agent}), TODO fix sub
  ],
});

export default DashboardContainer;
