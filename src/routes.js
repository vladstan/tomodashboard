import React from 'react';

import { IndexRoute, Route } from 'react-router';

// import AppQueries from './queries/AppQueries';
import DashboardQueries from './queries/DashboardQueries';
import UserChatQueries from './queries/UserChatQueries';

import App from './pages/App';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import OfferPage from './pages/OfferPage';
import SummaryPage from './pages/SummaryPage';
import UserChat from './pages/UserChat';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Home} />
    <Route path='dashboard' component={Dashboard} queries={DashboardQueries}>
      <IndexRoute component={DashboardHome} />
      <Route path='chat/:uid' component={UserChat} queries={UserChatQueries} />
    </Route>
    <Route path='landing' component={LandingPage} />
    <Route path='summary/:id' component={SummaryPage} />
    <Route path='offers/:id' component={OfferPage} />
  </Route>
);
