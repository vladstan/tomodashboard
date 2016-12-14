import React from 'react';
import {routerShape} from 'react-router';

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

class Header extends React.Component {

  static contextTypes = {
    router: routerShape.isRequired,
  }

  handleLogOut() {
    this.context.router.push('/logout');
  }

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
                  <Navbar.Header>
                    <Navbar.Brand tabIndex='-1'>
                      <a href='/'>TOMO</a>
                    </Navbar.Brand>
                  </Navbar.Header>
                </Col>
                <Col xs={3} sm={8} collapseRight className='text-right'>
                  <Nav pullRight>
                    <Nav>
                      <NavItem className='logout' style={{cursor: 'pointer'}} onClick={::this.handleLogOut}>
                        <Icon bundle='fontello' glyph='off-1' />
                      </NavItem>
                    </Nav>
                  </Nav>
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
