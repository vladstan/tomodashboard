import React from 'react';

import {
  Sidebar, SidebarNav, SidebarNavItem,
  SidebarControls, SidebarControlBtn,
  LoremIpsum, Grid, Row, Col, FormControl,
  Label, Progress, Icon,
  SidebarDivider
} from '@sketchpixy/rubix';

import NotificationsComponent from '../notifications/notifications';
import ChatComponent from '../chat/chat';
import StatisticsComponent from '../stats/stats';

import { Link, withRouter } from 'react-router';

@withRouter
class ApplicationSidebar extends React.Component {
  handleChange(e) {
    this._nav.search(e.target.value);
  }

  getPath(path) {
    var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
    path = `/${dir}/${path}`;
    return path;
  }

  render() {
    return (
      <div>

        <Grid>
          <Row>
            <Col xs={12}>
              <FormControl type='text' placeholder='Search...' onChange={::this.handleChange} className='sidebar-search' style={{border: 'none', background: 'none', margin: '10px 0 0 0', borderBottom: '1px solid #666', color: 'white'}} />
              <div className='sidebar-nav-container'>
                <SidebarNav style={{marginBottom: 0}} ref={(c) => this._nav = c}>

                  { /** Pages Section */ }
                  <div className='sidebar-header'>Broadcasting</div>

                  <SidebarNavItem glyph='icon-outlined-mail-open' name='Text' href={::this.getPath('text')} />
                  <SidebarNavItem glyph='icon-pixelvicon-photo-gallery' name='Image' href={::this.getPath('image')} />
                  <SidebarNavItem glyph='icon-dripicons-message' name='Card' href={::this.getPath('card')} />

                  <SidebarDivider />
                </SidebarNav>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}



@withRouter
export default class SidebarContainer extends React.Component {
  render() {
    return (
      <div id='sidebar' {...this.props}>
        <div id='avatar'>
          <Grid>
            <Row className='fg-white'>
              <Col xs={4} collapseRight>
                <img src='/imgs/app/avatars/avatar17.png' width='40' height='40' />
              </Col>
              <Col xs={8} collapseLeft id='avatar-col'>
                <div style={{top: 23, fontSize: 16, lineHeight: 1, position: 'relative'}}>Agent Smith</div>
                <div>
                  <Progress id='demo-progress' value={30} color='#ffffff'/>
                  <a href='#'>
                    <Icon id='demo-icon' bundle='fontello' glyph='lock-5' />
                  </a>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
        <SidebarControls>
          <SidebarControlBtn bundle='fontello' glyph='bell-5' sidebar={0} />
          <SidebarControlBtn bundle='fontello' glyph='flag-1' sidebar={1} />
          <SidebarControlBtn bundle='fontello' glyph='chat-1' sidebar={2} />
          <SidebarControlBtn bundle='fontello' glyph='chart-pie-2' sidebar={3} />
        </SidebarControls>
        <div id='sidebar-container'>
        <Sidebar sidebar={0}>
          <NotificationsComponent />
        </Sidebar>
          <Sidebar sidebar={1}>
            <ChatComponent />
          </Sidebar>
          <Sidebar sidebar={2}>
            <ApplicationSidebar />
          </Sidebar>
          <Sidebar sidebar={3}>
            <StatisticsComponent />
          </Sidebar>
        </div>
      </div>
    );
  }
}
