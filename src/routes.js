import React from 'react';
import Relay from 'react-relay';
import RelaySubscriptions from 'relay-subscriptions';
import { withRouter } from 'react-router';

import AddIncomingReqSubscription from './subscriptions/AddIncomingReqSubscription';

import { IndexRoute, Route } from 'react-router';
import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';

import Footer from './components/Footer';
import Header from './components/Header';
import AppSidebar from './components/AppSidebar';

import AppQueries from './queries/AppQueries';
import UserChatQueries from './queries/UserChatQueries';

import Home from './pages/Home';
import UserChat from './pages/UserChat';

@withRouter
class App extends React.Component {
  render() {
    return (
      <MainContainer {...this.props}>
        <AppSidebar user={this.props.user} />
        <Header />
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

const AppContainer = RelaySubscriptions.createContainer(App, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id
        _id
        ${AddIncomingReqSubscription.getFragment('user')}
        facebookId
        profile {
          id
          _id
          userId
          name
        }
        incomingReqs(first: 10) {
          edges {
            node {
              id
              _id
              type
              userId
              messageText
            }
          }
        }
      }
    `
  },
  subscriptions: [
    ({user}) => new AddIncomingReqSubscription({user}),
  ],
});

export default (
  <Route path='/' component={AppContainer} queries={AppQueries}>
    <IndexRoute component={Home} />
    <Route path='chat/:uid' component={UserChat} queries={UserChatQueries} />
  </Route>
);
