import React from 'react';

import {
  Sidebar, SidebarNav, SidebarNavItem,
  SidebarControls, SidebarControlBtn,
  LoremIpsum, Grid, Row, Col, FormControl,
  Label, Progress, Icon,
  SidebarDivider
} from '@sketchpixy/rubix';

import { Link, withRouter } from 'react-router';

@withRouter
class ApplicationSidebar extends React.Component {
  handleChange(e) {
    this._nav.search(e.target.value);
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <FormControl type='text' placeholder='Search (user, tags)...' onChange={::this.handleChange} className='sidebar-search' style={{border: 'none', background: 'none', margin: '10px 0 0 0', borderBottom: '1px solid #666', color: 'white'}} />
              <div className='sidebar-nav-container'>
                <SidebarNav style={{marginBottom: 0}} ref={(c) => this._nav = c}>

                  { /** Pages Section */ }
                  <Col xs={12}>
                    <div className='sidebar-header'>Messages</div>
                    <div>The user can send new messeges from here. The selection is here: text, card, img.</div>
                  </Col>
{/*
                  <SidebarNavItem glyph='icon-fontello-plus-1' name='Text' href='/' />
                  <SidebarNavItem glyph='icon-fontello-plus-1' name='Images' href='/' />
                  <SidebarNavItem glyph='icon-fontello-plus-1' name='Cards' href='/' /> */}

                </SidebarNav>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

class Stats extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <div className='sidebar-header'>Stats</div>
            <div>This is where we can show some stats for the agent, to help him improve his skills.</div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

class Messages extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <div className='sidebar-header'>Messages</div>
            <div>The user can send new messeges from here. The selection is here: text, card, img.</div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

class Notifications extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <div className='sidebar-header'>Notofications</div>
            <div> We should list here the requests from the users.</div>
          </Col>
        </Row>
      </Grid>
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
          <SidebarControlBtn bundle='fontello' glyph='chat-1' sidebar={1} />
          <SidebarControlBtn bundle='fontello' glyph='chart-pie-2' sidebar={2} />
        </SidebarControls>
        <div id='sidebar-container'>
        <Sidebar sidebar={0}>
          <Notifications />
        </Sidebar>
          <Sidebar sidebar={1}>
            <ApplicationSidebar />
          </Sidebar>
          <Sidebar sidebar={2}>
            <Stats />
          </Sidebar>
        </div>
      </div>
    );
  }
}
