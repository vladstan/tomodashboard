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
import SuggestionsModal from './SuggestionsModal';
import ImageModal from './ImageModal';

import UpdateAgentWatermarksMutation from '../mutations/UpdateAgentWatermarksMutation';
import UpdateAgentTypingStatusMutation from '../mutations/UpdateAgentTypingStatusMutation';

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
          <img src={this.props.imageUrl} style={{maxWidth: 300, maxHeight: 300}} />
        </span>
      );
    } else if (this.props.cards && this.props.cards.length) {
      // console.log(this.props.cards);
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
          {
            this.props.cards.map(c => (
              <div key={JSON.stringify(c)}>
                <img src={c.pictureUrl} style={{maxWidth: 300, maxHeight: 200}} />
                <p style={{background: '#F3F1F2', padding: '10px 15px 8px', borderRadius: '20px'}}>
                  {c.title}
                  <br/>
                  <span style={{fontSize: 12}}>{c.description}</span>
                </p>
              </div>
            ))
          }
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
    showImageModal: false,
    showSuggestionsModal: false,
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

  closeImageModal() {
		this.setState({
      ...this.state,
      showImageModal: false,
    });
  }

  openImageModal() {
		this.setState({
      ...this.state,
      showImageModal: true,
    });
  }

  closeSuggestionsModal() {
		this.setState({
      ...this.state,
      showSuggestionsModal: false,
    });
  }

  openSuggestionsModal() {
		this.setState({
      ...this.state,
      showSuggestionsModal: true,
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
    const msg = event.target.value;
    if (this.state.messageInputText && !msg) {
      // console.log('stopped');
      this.sendTypingStatus(false);
    } else if (!this.state.messageInputText && msg) {
      // console.log('started');
      this.sendTypingStatus(true);
    }
    this.setState({
      messageInputText: msg,
    });
  }

  sendTypingStatus(isTyping) {
    const { relay, agent, user } = this.props;
    relay.commitUpdate(
      new UpdateAgentTypingStatusMutation({
        agent,
        user,
        isTyping,
      }),
    );
  }

  onKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSend();
    }
  }

  componentDidMount() {
    if (typeof window != 'undefined') {
      if (!this._bound_onWindowFocus) {
        this._bound_onWindowFocus = ::this.onWindowFocus;
        window.addEventListener('focus', this._bound_onWindowFocus, false);
        // console.log('started listening for onFocus');
      }
    }
  }

  componentWillUnmount() {
    if (typeof window != 'undefined') {
      window.removeEventListener('focus', this._bound_onWindowFocus);
      delete this._bound_onWindowFocus;
    }
  }

  onWindowFocus() {
    // console.log('onWindowFocus');
    // console.log('this.hasAgentReadLastMesage()=', this.hasAgentReadLastMesage());
    if (!this.hasAgentReadLastMesage()) {
      // console.log('onWindowFocus', new Date());
      this.sendMarkAsReadLastMessage();
    }
  }

  sendMarkAsReadLastMessage() {
    console.log('MARK AS READ!!', Date.now());
    const { relay, agent, user } = this.props;
    relay.commitUpdate(
      new UpdateAgentWatermarksMutation({
        agent,
        user,
        lastReadWatermark: Date.now() + '',
      }),
    );
  }

  componentWillReceiveProps(nextProps) {
    try {
      // console.log('componentWillReceiveProps(nextProps) {');
      if (typeof Notification == 'undefined' || typeof document == 'undefined') {
        // console.log('no Notification');
        return;
      }
      // console.log('yes Notification');

      const newLastMessage = nextProps.messages[nextProps.messages.length - 1];
      const lastMessage = this.props.messages && this.props.messages[this.props.messages.length - 1] || {};

      // console.log(newLastMessage, lastMessage);

      if (lastMessage.text != newLastMessage.text && newLastMessage.senderType == 'user') {
        // console.log('NOTIF{}', this.props.profile.name, {
        //   body: newLastMessage.text,
        // });
        if (document.hasFocus()) {
          // console.log('document.hasFocus() true', new Date());
          this.sendMarkAsReadLastMessage();
        } else {
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
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  getLastMessage(type) {
    if (type === 'agent') {
      const messages = this.props.messages.filter(m => m.senderType === 'bot');
      return messages.length && messages[messages.length - 1];
    }

    if (type === 'user') {
      const messages = this.props.messages.filter(m => m.senderType === 'user');
      return messages.length && messages[messages.length - 1];
    }
  }

  hasAgentReadLastMesage() {
    // console.log('hasAgentReadLastMesage.....');

    const agent = this.props.agent;
    const lastUserMessage = this.getLastMessage('user');

    const lastReadWatermark = parseInt(agent.lastReadWatermark || '0', 10) || 0;
    // console.log('lastReadWatermark, lastUserMessage====', lastReadWatermark, lastUserMessage);

    if (lastUserMessage) {
      if (lastReadWatermark && lastReadWatermark >= parseInt(lastUserMessage.timestamp, 10)) {
        // agent has read all messages
        return true;
      }
    } else {
      return true;
    }

    return false;
  }

  render() {
    try {
      let status = null;
      const user = this.props.user;

      const lastReadWatermark = parseInt(user.lastReadWatermark || '0', 10) || 0;
      const lastDeliveredWatermark = parseInt(user.lastDeliveredWatermark || '0', 10) || 0;
      const lastAgentMessage = this.getLastMessage('agent');

      // console.log('lastReadWatermark:', lastReadWatermark);
      // console.log('lastDeliveredWatermark:', lastDeliveredWatermark);
      // console.log('lastAgentMessage:', lastAgentMessage);

      if (lastAgentMessage) {
        if (lastReadWatermark && lastReadWatermark >= parseInt(lastAgentMessage.timestamp, 10)) {
          status = (
            <span>Read</span>
          );
        } else if (lastDeliveredWatermark && lastDeliveredWatermark >= parseInt(lastAgentMessage.timestamp, 10)) {
          status = (
            <span>Delivered</span>
          );
        }
      }

      console.log('RENDERING MSGS', this.props.messages);

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
                      cards={m.cards && JSON.parse(m.cards)}
                      text={m.text} />
                  ))}
                </ul>
                <div className="status" style={{textAlign: 'right'}}>
                  {status}
                </div>
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
                          <a onClick={::this.openSummaryModal} style={{border: 'none', cursor: 'pointer'}} title="Send summary">
                            <Icon glyph='icon-dripicons-align-justify icon-1-and-quarter-x fg-text' style={{marginRight: 25}} />
                          </a>
                          <a onClick={::this.openImageModal} style={{border: 'none', cursor: 'pointer'}} title="Send image">
                            <Icon glyph='icon-dripicons-camera icon-1-and-quarter-x fg-text' style={{marginRight: 25}} />
                          </a>
                          <a onClick={::this.openSuggestionsModal} style={{border: 'none', cursor: 'pointer'}} title="Send suggestions">
                            <Icon glyph='icon-fontello-flow-split icon-1-and-quarter-x fg-text' style={{marginRight: 25}} />
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
            sendLink={this.props.sendMessage}
            getSummaryLink={this.props.getSummaryLink} />

          <ImageModal
            show={this.state.showImageModal}
            onClose={::this.closeImageModal}
            sendImage={this.props.sendImageMessage} />

          <SuggestionsModal
            show={this.state.showSuggestionsModal}
            onClose={::this.closeSuggestionsModal}
            sendSuggestionsMessage={this.props.sendSuggestionsMessage} />
        </div>
      );
    } catch (ex) {
      console.error(ex);
    }
  }

}

export default ChatConversation;
