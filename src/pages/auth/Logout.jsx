import debug from 'debug';

import React from 'react';
import {routerShape} from 'react-router';

import auth from '../../auth';

const log = debug('tomo:auth:logout');

class Logout extends React.Component {

  static contextTypes = {
    router: routerShape.isRequired,
  }

  static propTypes = {
    prevLoc: React.PropTypes.string,
    logoutReason: React.PropTypes.string,
  }

  componentWillMount() {
    log('componentWillMount: removing access token');
    auth.removeAccessToken();

    log('componentWillMount: redirecting to /login');
    this.context.router.replace({
      pathname: '/login',
      query: {
        prevLoc: this.props.prevLoc,
        logoutReason: this.props.logoutReason,
      },
    });
  }

  render() {
    return null;
  }

}

export default Logout;
