import React from 'react';

import { IndexRoute, Route } from 'react-router';
import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';

import Footer from './components/Footer';
import Header from './components/Header';
import AppSidebar from './components/AppSidebar';

// import UserChatQueries from './queries/UserChatQueries';
// import TestQueries from './queries/TestQueries';

import Home from './pages/Home';
import UserChat from './pages/UserChat';

class App extends React.Component {
  render() {
    return (
      <MainContainer {...this.props}>
        <AppSidebar />
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
    <IndexRoute component={Home} />
    <Route path='chat/:uid' component={UserChat} />
  </Route>
);

// queries={TestQueries}
// queries={UserChatQueries}
