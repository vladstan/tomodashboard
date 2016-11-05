import React from 'react';

import { IndexRoute, Route } from 'react-router';

// import AppQueries from './queries/AppQueries';
import DashboardQueries from './queries/DashboardQueries';
import UserChatQueries from './queries/UserChatQueries';
import SummaryPageQueries from './queries/SummaryPageQueries';

import App from './pages/App';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import OfferPage from './pages/OfferPage';
import SummaryPage from './pages/SummaryPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import LoginPage from './pages/Login';
import UserChat from './pages/UserChat';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';

export default {
  get(req) {
    function requireAuth(nextState, replace) {
      const loggedIn = !!(typeof window != 'undefined' && window.localStorage.auth_token)
        || !!(req && req.cookies.auth_token)
        || false;

      const prevLoc = (typeof window != 'undefined' && window.location.pathname)
        || (req && req.url)
        || '';

      if (!loggedIn) {
        // console.log('redir to login', typeof window != 'undefined' && window.location);
        replace({
          pathname: '/login',
          state: { nextPathname: nextState.location.pathname },
          query: { prevLoc },
        });
      }
    }

    function toDashboardIfLoggedIn(nextState, replace) {
      const loggedIn = !!(typeof window != 'undefined' && window.localStorage.auth_token)
        || !!(req && req.cookies.auth_token)
        || false;

      if (loggedIn) {
        replace({
          pathname: '/dashboard',
          state: { nextPathname: nextState.location.pathname },
        });
      }
    }

    function getAgentToken() {
      return (typeof window != 'undefined' && window.localStorage.auth_token)
        || (req && req.cookies.auth_token)
        || null;
    }

    function prepAgentParams(params) {
      return {
        ...params,
        authToken: getAgentToken(),
      };
    }

    return (
      <Route path='/' component={App}>
        <IndexRoute component={Home} />
        <Route path='dashboard' component={Dashboard} queries={DashboardQueries} onEnter={requireAuth} prepareParams={prepAgentParams}>
          <IndexRoute component={DashboardHome} />
          <Route path='chat/:uid' component={UserChat} queries={UserChatQueries} prepareParams={prepAgentParams} />
        </Route>
        <Route path='landing' component={LandingPage} />
        <Route path='summary/:sid' component={SummaryPage} queries={SummaryPageQueries} />
        <Route path='success/:id' component={PaymentSuccessPage} />
        <Route path='offers/:id' component={OfferPage} />
        <Route path='login' component={LoginPage} />
      </Route>
    );
  }
}; //  onEnter={toDashboardIfLoggedIn} TODO

// /**
//    * Please keep routes in alphabetical order
//    */
//   return (
//     <Route path="/" component={App}>
//       { /* Home (main) route */ }
//       <IndexRoute component={Home}/>
//
//       { /* Routes requiring login */ }
//       <Route onEnter={requireLogin}>
//         <Route path="chat" component={Chat}/>
//         <Route path="loginSuccess" component={LoginSuccess}/>
//       </Route>
//
//       { /* Routes */ }
//       <Route path="about" component={About}/>
//       <Route path="login" component={Login}/>
//       <Route path="survey" component={Survey}/>
//       <Route path="widgets" component={Widgets}/>
//
//       { /* Catch all route */ }
//       <Route path="*" component={NotFound} status={404} />
//     </Route>
//   );
