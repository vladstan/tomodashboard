import React from 'react';
import {IndexRoute, IndexRedirect, Route} from 'react-router';

import dashboardQueries from './queries/dashboard';
import userChatQueries from './queries/user-chat';
import summaryPageQueries from './queries/summary-page';

import SessionExpiredError from './errors/SessionExpiredError';

import App from './pages/App';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import UserChat from './pages/UserChat';

import LandingPage from './pages/LandingPage';
import OfferPage from './pages/OfferPage';
import SummaryPage from './pages/SummaryPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

export default (
  <Route path='/' component={App}>
    <IndexRedirect to='dashboard' />

    <Route path='dashboard' component={Dashboard} queries={dashboardQueries}
        render={onRender} onEnter={requireAuth} prepareParams={prepParams}>
      <IndexRoute component={DashboardHome} />
      <Route path='chat/:uid' component={UserChat} queries={userChatQueries} prepareParams={prepParams} />
    </Route>

    <Route path='landing' component={LandingPage} />
    <Route path='summary/:sid' component={SummaryPage} queries={summaryPageQueries} prepareParams={prepParams} />
    <Route path='success/:id' component={PaymentSuccessPage} />
    <Route path='offers/:id' component={OfferPage} />

    <Route path='login' component={Login} onEnter={onLogIn} />
    <Route path='logout' onEnter={onLogOut} />
  </Route>
);

function getAccessToken() {
  return localStorage.getItem('access_token');
}

function removeAccessToken() {
  return localStorage.removeItem('access_token');
}

function isLoggedIn() {
  return !!getAccessToken();
}

function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    const prevLoc = nextState.location.pathname;
    replace({pathname: '/login', query: {prevLoc}});
  }
}

function onRender({error, props, routerProps, element}) { // eslint-disable-line react/prop-types
  // known errors
  if (error instanceof SessionExpiredError) {
    // force the user to log in again
    const prevLoc = routerProps.location.pathname;
    routerProps.router.push({pathname: '/logout', query: {prevLoc}});
    return;
  }

  // unknown error
  if (error) {
    console.error(error);
    return;
  }

  // still loading
  if (!props) {
    // don't show anything new
    return;
  }

  return React.cloneElement(element, props);
}

function onLogIn(nextState, replace) {
  if (isLoggedIn()) {
    replace('/dashboard');
  }
}

function onLogOut(nextState, replace) {
  removeAccessToken();
  replace('/login');
}

function prepParams(params) {
  return {
    ...params,
    accessToken: getAccessToken(),
  };
}
