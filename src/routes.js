import React from 'react';
import auth from './auth';

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

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Home} />
    <Route path='dashboard' component={Dashboard} queries={DashboardQueries} onEnter={requireAuth}>
      <IndexRoute component={DashboardHome} />
      <Route path='chat/:uid' component={UserChat} queries={UserChatQueries} />
    </Route>
    <Route path='landing' component={LandingPage} />
    <Route path='summary/:id' component={SummaryPage} queries={SummaryPageQueries} onEnter={requireAuth} />
    <Route path='success/:id' component={PaymentSuccessPage} onEnter={requireAuth} />
    <Route path='offers/:id' component={OfferPage} onEnter={requireAuth} />
    <Route path='login' component={LoginPage} />
  </Route>
);

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
