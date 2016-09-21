import React from 'react';

import { IndexRoute, Route } from 'react-router';

// import AppQueries from './queries/AppQueries';
import DashboardQueries from './queries/DashboardQueries';
import UserChatQueries from './queries/UserChatQueries';

import App from './pages/App';
import Home from './pages/Home';
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
  </Route>
);
