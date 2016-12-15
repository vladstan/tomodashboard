import React from 'react';
import {IndexRoute, IndexRedirect, Route} from 'react-router';

import auth from './auth';

import agentViewerQueries from './queries/agent-viewer';
import summaryPageQueries from './queries/summary-page';

import SessionExpiredError from './errors/SessionExpiredError';

import App from './pages/App';

import Login from './pages/auth/Login';
import Logout from './pages/auth/Logout';

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

    <Route path='dashboard' component={Dashboard} queries={agentViewerQueries}
        render={onRender} onEnter={requireAuth} prepareParams={prepParams}>
      <IndexRoute component={DashboardHome} />
      <Route path='chat/:userId' component={UserChat} queries={agentViewerQueries} prepareParams={prepParams} />
    </Route>

    <Route path='landing' component={LandingPage} />
    <Route path='summary/:sid' component={SummaryPage} queries={summaryPageQueries} prepareParams={prepParams} />
    <Route path='success/:id' component={PaymentSuccessPage} />
    <Route path='offers/:id' component={OfferPage} />

    <Route path='login' component={Login} />
    <Route path='logout' component={Logout} />
  </Route>
);

function requireAuth(nextState, replace) {
  if (!auth.isLoggedIn()) {
    const prevLoc = nextState.location.pathname;
    replace({pathname: '/login', query: {prevLoc}});
  }
}

function onRender({error, props, routerProps, element}) { // eslint-disable-line react/prop-types
  // known errors
  if (error instanceof SessionExpiredError) {
    // force the user to log in again
    const prevLoc = routerProps.location.pathname;
    const reason = 'Your session has expired. Please log in again.';
    return <Logout prevLoc={prevLoc} logoutReason={reason} />;
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

function prepParams(params, {location: {query}}) {
  return {
    ...params,
    accessToken: auth.getAccessToken(),
    plannerTripId: query.plannerTripId || null,
  };
}
