import React from 'react';

import {
  Grid, Row, Col,
} from '@sketchpixy/rubix';

import { Link } from 'react-router';

class ChatNav extends React.Component {
  render() {
    return (
      <ul className='sidebar-nav' style={this.props.style}>
        {this.props.children}
      </ul>
    );
  }
}

class ChatItem extends React.Component {
  render() {
    var isOffline = true;
    var status = 'border-darkgray';
    if(this.props.idle) status = 'border-yellow';
    if(this.props.busy) status = 'border-red';
    if(this.props.online) status = 'border-green';
    if(status !== 'border-darkgray') isOffline = false;
    return (
      <li tabIndex='-1'>
        <Link to={'/dashboard/chat/' + this.props.id}>
          <img src={this.props.avatar} width='30' height='30' className={status} style={{borderWidth: 2, borderStyle: 'solid', borderRadius: 100, padding: 2, position: 'relative', top: -7, opacity: isOffline ? 0.4 : 1}} />
          <span className='name' style={{position: 'relative', top: -2, opacity: isOffline ? 0.4 : 1}}>{this.props.name}</span>
        </Link>
      </li>
    );
  }
}

class ActiveChatsSidebar extends React.Component {
  render() {
    // console.log('ActiveChatsSidebar', this.props.users);
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <div className='sidebar-header'>All</div>
              <div className='sidebar-nav-container'>
                <ChatNav style={{marginBottom: 0}}>
                  {
                    this.props.users.map((user) => (
                      <ChatItem key={user._id} name={user.profile.name} avatar={user.profile.pictureUrl} id={user._id} online />
                    ))
                  }
                </ChatNav>
              </div>
              {/* <div className='sidebar-header'>Yestarday (3)</div>
              <div className='sidebar-nav-container'>
                <ChatNav style={{marginBottom: 0}}>
                  <ChatItem name='Toby King' avatar='avatar7' idle />
                  <ChatItem name='Ju Lan' avatar='avatar13' idle />
                  <ChatItem name='Lana Collin' avatar='avatar14' idle />
                </ChatNav>
              </div>
              <div className='sidebar-header'>LastWeek (4)</div>
              <div className='sidebar-nav-container'>
                <ChatNav style={{marginBottom: 0}}>
                  <ChatItem name='Alexandra Mordin' avatar='avatar20' busy />
                  <ChatItem name='Jonas Schäfer' avatar='avatar17' busy />
                  <ChatItem name='Ricardo Ibarra' avatar='avatar15' busy />
                  <ChatItem name='The Unknown' avatar='avatar16' busy />
                </ChatNav>
              </div>
              <div className='sidebar-header'>Last Month (3)</div>
              <div className='sidebar-nav-container'>
                <ChatNav style={{marginBottom: 0}}>
                  <ChatItem name='Evan Poulain' avatar='avatar19' />
                  <ChatItem name='Canan Erdem' avatar='avatar18' />
                  <ChatItem name='Antelope Inc.' avatar='avatar8' />
                </ChatNav>
                <br/>
              </div> */}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default ActiveChatsSidebar;
