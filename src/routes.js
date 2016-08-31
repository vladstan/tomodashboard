import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';
import { IndexRoute, Route } from 'react-router';

import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';

import Footer from './common/footer';
import Header from './common/header';
import Sidebar from './common/sidebar';

import UserChatQueries from './queries/UserChatQueries';
import TestQueries from './queries/TestQueries';

import Home from './pages/Home';
import UserChat from './pages/UserChat';

class App extends React.Component {
  render() {
    return (
      <MainContainer {...this.props}>
        <Sidebar />
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

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Home} queries={TestQueries} />
    <Route path='chat/:uid' component={UserChat} queries={UserChatQueries} />
  </Route>
);
