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

import SummaryModal from './SummaryModal';

class ChatConversationItem extends React.Component {

  render() {
    try {
      return (
        <li tabIndex='-1' style={{
          textAlign: this.props.position,
          display: 'block',
          marginBottom: '15px',
          listStyle: 'none'
        }}>
          {this.props.position == 'left' && this._renderAvatar()}
          {this._renderBody()}
          {this.props.position == 'right' && this._renderAvatar()}
        </li>
      );
    } catch (ex) {
      console.error(ex);
    }
  }

  _renderAvatar() {
    return (
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
  }

  _renderBody() {
    // console.log(this.props);
    if (this.props.imageUrl) {
      return (
        <span
          className='body'
          style={{
            position: 'relative',
            top: -2,
            padding: '10px 15px 8px',
            borderRadius: '20px',
            marginLeft: '10px',
            marginRight: '10px'
          }}>
          <img src={this.props.imageUrl} />
        </span>
      );
    } else {
      return (
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
      );
    }
  }

}

class ChatConversation extends React.Component {

  state = {
    messageInputText: '',
    showSummaryModal: false,
  }

  closeSummaryModal() {
		this.setState({
      ...this.state,
      showSummaryModal: false,
    });
  }

  openSummaryModal() {
		this.setState({
      ...this.state,
      showSummaryModal: true,
    });
  }

  onSend() {
    if (this.state.messageInputText) {
      this.props.sendMessage(this.state.messageInputText);
      this.setState({
        messageInputText: '',
      });
    }
  }

  onMessageTextChange(event) {
    this.setState({
      messageInputText: event.target.value,
    });
  }

  onKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSend();
    }
  }

  sendSummaryLink(link) {
    this.props.sendMessage(link);
  }

  componentWillReceiveProps(nextProps) {
    try {
      // console.log('componentWillReceiveProps(nextProps) {');
      if (typeof Notification == 'undefined') {
        // console.log('no Notification');
        return;
      }
      // console.log('yes Notification');

      // dashboard is focused
      if (typeof document != 'undefined' && document.hidden === false) {
        return;
      }

      const newLastMessage = nextProps.messages[nextProps.messages.length - 1];
      const lastMessage = this.props.messages && this.props.messages[this.props.messages.length - 1] || {};

      // console.log(newLastMessage, lastMessage);

      if (lastMessage.text != newLastMessage.text && newLastMessage.senderType == 'user') {
        // console.log('NOTIF{}', this.props.profile.name, {
        //   body: newLastMessage.text,
        // });
        if (Notification.permission == 'default') {
          Notification.requestPermission((permission) => {
            if (permission === "granted") {
              new Notification(this.props.profile.name, {
                body: newLastMessage.text,
              });
            }
          });
        } else if (Notification.permission == 'granted') {
          new Notification(this.props.profile.name, {
            body: newLastMessage.text,
          });
        }
      }
    } catch (ex) {
      console.error(ex);
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
                    avatarUrl={m.senderType === 'user' ? this.props.profile.pictureUrl : this.props.agent.pictureUrl}
                    imageUrl={m.imageUrl}
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
                        <a onClick={::this.openSummaryModal} style={{border: 'none', cursor: 'pointer'}}>
                          <Icon glyph='icon-dripicons-calendar icon-1-and-quarter-x fg-text' style={{marginRight: 25}} />
                        </a>
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

        <SummaryModal
          show={this.state.showSummaryModal}
          onClose={::this.closeSummaryModal}
          sendLink={::this.sendSummaryLink}
          getSummaryLink={this.props.getSummaryLink} />
      </div>
    );
  }

}

export default ChatConversation;
