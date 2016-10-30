import React from 'react';
// import { withRouter } from 'react-router';

import {
  SidebarBtn,
  Navbar,
  Nav,
  NavItem,
  Icon,
  Grid,
  Row,
  Col,
} from '@sketchpixy/rubix';

class Brand extends React.Component {
  render() {
    return (
      <Navbar.Header {...this.props}>
        <Navbar.Brand tabIndex='-1'>
          <a href='#'>YAGO
            {/* <img src='/imgs/app/TUI-logo.jpg' alt='rubix' height='28' /> */}
          </a>
        </Navbar.Brand>
      </Navbar.Header>
    );
  }
}

// @withRouter
class HeaderNavigation extends React.Component {
  logOut() {
    function deleteCookie(name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    if (typeof window != 'undefined') { // browser
      window.localStorage.removeItem('auth_token');
      deleteCookie('auth_token');
      this.props.redirectToLogin();
    }
  }

  render() {
    return (
      <Nav pullRight>
        <Nav>
          <NavItem className='logout' style={{cursor: 'pointer'}} onClick={::this.logOut}>
            <Icon bundle='fontello' glyph='off-1' />
          </NavItem>
        </Nav>
      </Nav>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <Grid id='navbar'>
        <Row>
          <Col xs={12}>
            <Navbar fixedTop fluid id='rubix-nav-header'>
              <Row>
                <Col xs={3} visible='xs'>
                  <SidebarBtn />
                </Col>
                <Col xs={6} sm={4}>
                  <Brand />
                </Col>
                <Col xs={3} sm={8} collapseRight className='text-right'>
                  <HeaderNavigation redirectToLogin={() => this.props.router.push('/login')} />
                </Col>
              </Row>
            </Navbar>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Header;
