import React from 'react';

import {
  Row,
  Col,
  Icon,
  Grid,
  Panel,
  Image,
  Button,
  PanelBody,
  PanelHeader,
  PanelFooter,
  FormControl,
  PanelContainer,
} from '@sketchpixy/rubix';

class SocialBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      follow: 'follow me',
      followActive: false,
      likeCount: 999,
      likeActive: false,
      likeTextStyle: 'fg-white'
    };
  }
  handleFollow() {
    this.setState({
      follow: 'followed',
      followActive: true
    });
  }
  handleLike() {
    this.setState({
      likeCount: 1000,
      likeActive: true,
      likeTextStyle: 'fg-orange75'
    });
  }
  render() {
    return (
      <div style={{height: 350, marginTop: -25, backgroundImage: 'url(/imgs/app/shots/Blick_auf_Manhattan.JPG)', backgroundSize: 'cover', position: 'relative', marginBottom: 25, backgroundPosition: 'center'}}>
        <div className='social-cover' style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
        </div>
        <div className='social-desc'>
          <div>
            <h1 className='fg-white'>Empire State, NY, USA</h1>
            <h5 className='fg-white' style={{opacity: 0.8}}>- Aug 20th, 2014</h5>
            <div style={{marginTop: 50}}>
              <div style={{display: 'inline-block'}}>
                <Button id='likeCount' retainBackground rounded bsStyle='orange75' active={this.state.likeActive} onClick={::this.handleLike}>
                  <Icon glyph='icon-fontello-heart-1' />
                </Button>
                <label className='social-like-count' htmlFor='likeCount'><span className={this.state.likeTextStyle}>{this.state.likeCount} likes</span></label>
              </div>
            </div>
          </div>
        </div>
        <div className='social-avatar'>
          <Image src='/imgs/app/avatars/avatar.jpg' height='100' width='100' style={{display: 'block', borderRadius: 100, border: '2px solid #fff', margin: 'auto', marginTop: 50}} />
          <h4 className='fg-white text-center'>Anna Sanchez</h4>
          <h5 className='fg-white text-center' style={{opacity: 0.8}}>DevOps Engineer, NY</h5>
          <hr className='border-black75' style={{borderWidth: 2}}/>
          <div className='text-center'>
            <Button outlined inverse retainBackground active={this.state.followActive} bsStyle='brightblue' onClick={::this.handleFollow}>
              <span>{this.state.follow}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default class UserChat extends React.Component {
  componentDidMount() {
    $('#body, html').addClass('social');
    (() => {
      // create a map in the "map" div, set the view to a given place and zoom
      var map = L.map('map', {
        scrollWheelZoom: false
      }).setView([40.7127, -74.0059], 16);

      // add an OpenStreetMap tile layer
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // add a marker in the given location, attach some popup content to it and open the popup
      L.marker([40.7127, -74.0059]).addTo(map)
          .openPopup();
    })();
  }

  componentWillUnmount() {
    $('#body, html').removeClass('social');
  }

  render() {
    return (
      <Row className='social'>
        <Col xs={12}>
          <Row>
            <Col sm={6} collapseRight>
              <PanelContainer>
                <PanelBody style={{padding: 25, paddingTop: 12.5}}>
                  <div className='inbox-avatar'>
                    <img src='/imgs/app/avatars/avatar7.png' width='40' height='40' />
                    <div className='inbox-avatar-name'>
                      <div className='fg-darkgrayishblue75'>Toby King</div>
                      <div className='fg-text'><small>Wisconsin, USA</small></div>
                    </div>
                    <div className='inbox-date hidden-sm hidden-xs fg-text text-right'>
                      <div style={{position: 'relative', top: 0}}><Icon glyph='icon-fontello-anchor icon-1-and-quarter-x'/></div>
                      <div style={{position: 'relative', top: -10}}><small><strong>2 hours ago</strong></small></div>
                    </div>
                  </div>
                  <div>
                    <div className='fg-text'>
                      {"Can you tell me what public transport I can get from here to the airport?"}
                    </div>
                  </div>
                </PanelBody>
              </PanelContainer>
              <PanelContainer>
                <PanelBody style={{padding: 12.5}}>
                  <FormControl componentClass='textarea' rows='3' placeholder="Here is the Chat session." style={{border: 'none'}} />
                </PanelBody>
                <PanelFooter className='fg-black75 bg-gray' style={{padding: '12.5px 25px'}}>
                  <Grid>
                    <Row>
                      <Col xs={6} collapseLeft collapseRight>
                      </Col>
                      <Col xs={6} className='text-right' collapseLeft collapseRight>
                        <Button bsStyle='darkgreen45'>send</Button>
                      </Col>
                    </Row>
                  </Grid>
                </PanelFooter>
              </PanelContainer>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
