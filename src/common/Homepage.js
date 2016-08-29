import React from 'react';

import { withRouter } from 'react-router';
import classNames from 'classnames';

import {
  Row,
  Col,
  Tab,
  Nav,
  Grid,
  Label,
  Button,
  NavItem,
} from '@sketchpixy/rubix';


@withRouter
export default class Homepage extends React.Component {
  handleNavigation() {
    this.props.router.push('/ltr/dashboard');
  }

  render() {
    return (
      <div id='homepage-container'>
        <Button bsStyle='deepred' id='demo-btn' onClick={::this.handleNavigation}>Start The Demo</Button>
      </div>
    );
  }
}
