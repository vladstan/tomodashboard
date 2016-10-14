import React from 'react';

import {
  Row,
  Col,
  Icon,
  Grid,
  Button,
  PanelBody,
  PanelFooter,
  FormControl,
  PanelContainer,
} from '@sketchpixy/rubix';

class ChatConversationItem extends React.Component {
  render() {
    let leftImg;
    let rightImg;

    const img = (
      <img
        src={this.props.avatarUrl}
        width='30'
        height='30'
        style={{
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: 100,
          verticalAlign: 'top',
          padding: 2,
          position: 'relative',
          top: -7
        }} />
    );

    if (this.props.position === 'right') {
      rightImg = img;
    } else {
      leftImg = img;
    }

    return (
      <li tabIndex='-1' style={{
        textAlign: this.props.position,
        display: 'block',
        marginBottom: '15px',
        listStyle: 'none'
      }}>
        {leftImg}
        <span
          className='body'
          style={{
            position: 'relative',
            top: -2,
            background: '#F3F1F2',
            padding: '10px 15px 8px',
            borderRadius: '20px',
            marginLeft: '10px',
            marginRight: '10px'
          }}
          >{this.props.text}</span>
        {rightImg}
      </li>
    );
  }
}

class ChatConversation extends React.Component {
  state = {
    messageInputText: ''
  }

  onSend() {
    if (this.state.messageInputText) {
      this.props.sendMessage(this.state.messageInputText);
      this.setState({
        messageInputText: ''
      });
    }
  }

  onMessageTextChange(event) {
    this.setState({
      messageInputText: event.target.value
    });
  }

  onKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSend();
    }
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <ul style={{
                padding: 0,
                marginTop: '50px'
              }}>
                {this.props.messages.map(m => (
                  <ChatConversationItem
                    key={m.id}
                    position={m.senderType === 'user' ? 'left' : 'right'}
                    avatarUrl={m.senderType === 'user' ? this.props.profile.pictureUrl : '/imgs/app/avatars/avatar17.png'}
                    text={m.text} />
                ))}
              </ul>
              <PanelContainer style={{
                background: '#EAEDF1',
                marginTop: '20px',
                borderRadius: '5px'
              }}>
                <PanelBody className='fg-black75 bg-gray' style={{
                  width: '100%',
                  padding: '15px 15px 10px',
                  display: 'block'
                }}>
                  <FormControl componentClass='textarea' rows='3' placeholder="Send a text message..." style={{
                    border: 'none',
                    paddingTop: '10px',
                    borderRadius: '5px',
                    height: '40px',
                    width: '100%'
                  }} value={this.state.messageInputText} onChange={::this.onMessageTextChange} onKeyPress={::this.onKeyPress} />
                </PanelBody>
                <PanelFooter className='fg-black75 bg-gray' style={{
                  padding: '12.5px 25px',
                  marginTop: 0
                }}>
                  <Grid>
                    <Row>
                      <Col xs={6} collapseLeft collapseRight>
                        <a href='#' style={{border: 'none'}}><Icon glyph='icon-dripicons-location icon-1-and-quarter-x fg-text' style={{marginRight: 25}} /></a>
                        <a href='#' style={{border: 'none'}}><Icon glyph='icon-dripicons-camera icon-1-and-quarter-x fg-text' style={{marginRight: 25}} /></a>
                        <a href='#' style={{border: 'none'}}><Icon glyph='icon-dripicons-calendar icon-1-and-quarter-x fg-text' style={{marginRight: 25}} /></a>
                      </Col>
                      <Col xs={6} className='text-right' collapseLeft collapseRight>
                        <Button bsStyle='darkgreen45' onClick={::this.onSend}>send</Button>
                      </Col>
                    </Row>
                  </Grid>
                </PanelFooter>
              </PanelContainer>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default ChatConversation;
