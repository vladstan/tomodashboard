import debug from 'debug';

import React from 'react';
import Relay from 'react-relay';

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

import ImageModal from './modals/ImageModal';
import ChatConversationItem from './ChatConversationItem';

import UpdateUserWatermarksMutation from '../../mutations/chat/UpdateUserWatermarksMutation';
import UpdateAgentTypingStatusMutation from '../../mutations/chat/UpdateAgentTypingStatusMutation';
import SendMessageMutation from '../../mutations/chat/SendMessageMutation';

const log = debug('tomo:chat:ChatConversation');

class ChatConversation extends React.Component {

  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  }

  static propTypes = {
    agent: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
  }

  state = {
    messageInputText: '',
    showImageModal: false,
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

  onSend() {
    if (this.state.messageInputText) {
      log('sending message:', this.state.messageInputText);
      this.sendTextMessage(this.state.messageInputText);
      this.setState({
        messageInputText: '',
      });
    }
  }

  sendTextMessage(messageText) {
    log('sending text message', messageText);
    const {relay} = this.context;
    const {user, agent} = this.props;
    const sendMessageMutation = new SendMessageMutation({
      user,
      agent,
      type: 'text',
      text: messageText,
    });
    relay.commitUpdate(sendMessageMutation, {
      onSuccess: () => log('sent text message: ' + messageText),
      onFailure: (tx) => console.error(tx.getError()),
    });
  }

  sendImageMessage(link) {
    log('sending image message', link);
    const {relay} = this.context;
    const {user, agent} = this.props;
    const sendMessageMutation = new SendMessageMutation({
      user,
      agent,
      type: 'image',
      imageUrl: link,
    });
    relay.commitUpdate(sendMessageMutation, {
      onSuccess: () => log('sent image message: ' + link),
      onFailure: (tx) => console.error(tx.getError()),
    });
  }

  onMessageTextChange(event) {
    const msg = event.target.value;
    this.maybeUpdateTypingStatus(msg);
    this.setState({
      messageInputText: msg,
    });
  }

  maybeUpdateTypingStatus(typedMessage) {
    if (this.state.messageInputText && !typedMessage) {
      log('typing status: stopped');
      this.sendTypingStatus(false);
    } else if (!this.state.messageInputText && typedMessage) {
      log('typing status: typing');
      this.sendTypingStatus(true);
    }
  }

  sendTypingStatus(isTyping) {
    const {relay} = this.context;
    const {agent, user} = this.props;
    relay.commitUpdate(
      new UpdateAgentTypingStatusMutation({
        agent,
        user,
        isTyping,
      }),
      {
        onSuccess: () => log('updated agent typing status to isTyping=' + isTyping),
        onFailure: (tx) => console.error(tx.getError()),
      }
    );
  }

  onKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSend();
    }
  }

  componentDidMount() {
    if (!this._bound_onWindowFocus) {
      this._bound_onWindowFocus = ::this.onWindowFocus;
      window.addEventListener('focus', this._bound_onWindowFocus, false);
      log('focus: started listening for window onFocus');
    }
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this._bound_onWindowFocus);
    log('focus: stopped listening for window onFocus');
    delete this._bound_onWindowFocus;
  }

  onWindowFocus() {
    const hasRead = this.hasAgentReadLastMesage();
    log('focus: onWindowFocus() hasAgentReadLastMesage=' + hasRead);
    if (!hasRead) {
      this.sendMarkAsReadLastMessage();
    }
  }

  sendMarkAsReadLastMessage() {
    log('marking messages as read');
    const lastReadWatermark = Date.now() + '';
    const {relay} = this.context;
    const {agent, user} = this.props;
    relay.commitUpdate(
      new UpdateUserWatermarksMutation({
        agent,
        user,
        lastReadWatermark,
      }),
      {
        onSuccess: () => log('marked messages as read at ' + lastReadWatermark),
        onFailure: (tx) => console.error(tx.getError()),
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    const currentMessages = this.props.user.messages.edges.map((e) => e.node);
    const nextMessages = nextProps.user.messages.edges.map((e) => e.node);

    const lastMessage = currentMessages[currentMessages.length - 1];
    const newLastMessage = nextMessages[nextMessages.length - 1];

    const hasNewMessage = lastMessage && newLastMessage && lastMessage.text !== newLastMessage.text;
    const lastMessageIsFromUser = newLastMessage && newLastMessage.senderType === 'user';

    if (hasNewMessage && lastMessageIsFromUser) {
      log('focus: new message from user');
      if (document.hasFocus()) {
        log('focus: document is in focus, marking as read');
        this.sendMarkAsReadLastMessage();
      } else {
        log('focus: document is in not focus, showing notification');

        const showNotification = () => {
          if (Notification.permission === 'granted') {
            new Notification(this.props.user.profile.name, {
              body: newLastMessage.text,
            });
          } else {
            log('focus: cannot show notification, permission denied');
          }
        };

        if (Notification.permission === 'default') {
          log('focus: asking for permission to show notification');
          Notification.requestPermission(() => showNotification());
        } else {
          showNotification();
        }
      }
    }
  }

  /**
   * @return the last message sent by a sender of the given type
   */
  getLastMessage(type) {
    const messages = this.props.user.messages.edges.map((e) => e.node);

    if (type === 'agent') {
      const agentMessages = messages.filter((m) => m.senderType !== 'user'); // agent <=> both agent and bot
      return agentMessages.length && agentMessages[agentMessages.length - 1];
    }

    if (type === 'user') {
      const userMessages = messages.filter((m) => m.senderType === 'user');
      return userMessages.length && userMessages[userMessages.length - 1];
    }
  }

  hasAgentReadLastMesage() {
    const {user} = this.props;

    const lastUserMessage = this.getLastMessage('user');
    const lastReadWatermark = parseInt(user.lastReadWatermark || '0', 10) || 0;

    if (lastUserMessage) {
      if (lastReadWatermark && lastReadWatermark >= parseInt(lastUserMessage.timestamp, 10)) {
        // agent has read all messages
        return true;
      } else {
        // agent hasn't read last message(s)
        return false;
      }
    } else {
      // no messages sent by the user, assume true
      return true;
    }
  }

  render() {
    let status = null;

    const user = this.props.user;
    const messages = this.props.user.messages.edges.map((e) => e.node);

    const lastReadWatermark = parseInt(user.lastReadWatermark || '0', 10) || 0;
    const lastDeliveredWatermark = parseInt(user.lastDeliveredWatermark || '0', 10) || 0;
    const lastAgentMessage = this.getLastMessage('agent');

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

    const tomoAvatarPictureUrl = 'http://graph.facebook.com/hellotomoai/picture?type=square';

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <ul style={{
                padding: 0,
                marginTop: '50px',
              }}>
                {messages
                  .filter((m) => m.type)
                  .map((m) => (
                    <ChatConversationItem
                      key={m.id}
                      position={m.senderType === 'user' ? 'left' : 'right'}
                      avatarUrl={m.senderType === 'user'
                        ? this.props.user.profile.pictureUrl
                        : m.senderType === 'agent'
                        ? m.senderAgent.pictureUrl
                        : tomoAvatarPictureUrl}
                      imageUrl={m.imageUrl}
                      cards={m.cards && JSON.parse(m.cards)}
                      text={m.text} />
                  ))}
              </ul>
              <div className="status" style={{textAlign: 'right'}}>
                {status}
              </div>
              <PanelContainer className="chat-conversation-panel-container" style={{
                background: '#EAEDF1',
                marginTop: '20px',
                borderRadius: '5px',
              }}>
                <PanelBody className='fg-black75 bg-gray' style={{
                  width: '100%',
                  padding: '15px 15px 10px',
                  display: 'block',
                }}>
                  <FormControl componentClass='textarea' rows='3' placeholder="Send a text message..." style={{
                    border: 'none',
                    paddingTop: '10px',
                    borderRadius: '5px',
                    height: '40px',
                    width: '100%',
                  }} value={this.state.messageInputText} onChange={::this.onMessageTextChange} onKeyPress={::this.onKeyPress} />
                </PanelBody>
                <PanelFooter className='fg-black75 bg-gray' style={{
                  padding: '12.5px 25px',
                  marginTop: 0,
                }}>
                  <Grid>
                    <Row>
                      <Col xs={6} collapseLeft collapseRight>
                        <a onClick={::this.openImageModal} style={{border: 'none', cursor: 'pointer'}} title="Send image">
                          <Icon glyph='icon-dripicons-camera icon-1-and-quarter-x fg-text' style={{marginRight: 25}} />
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

        <ImageModal
          show={this.state.showImageModal}
          onClose={::this.closeImageModal}
          sendImage={::this.sendImageMessage} />
      </div>
    );
  }

}

const ChatConversationContainer = Relay.createContainer(ChatConversation, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        _id
        lastReadWatermark
        lastDeliveredWatermark

        ${SendMessageMutation.getFragment('user')}
        ${UpdateUserWatermarksMutation.getFragment('user')}
        ${UpdateAgentTypingStatusMutation.getFragment('user')}

        profile {
          name
          pictureUrl
        }

        messages(first: 1000) {
          edges {
            node {
              id
              _id
              type
              text
              cards
              senderId
              receiverId
              senderType
              receiverType
              timestamp
              imageUrl
              senderAgent {
                pictureUrl
              }
            }
          }
        }
      }
    `,
    agent: () => Relay.QL`
      fragment on Agent {
        _id

        ${SendMessageMutation.getFragment('agent')}
        ${UpdateAgentTypingStatusMutation.getFragment('agent')}
      }
    `,
  },
});

export default ChatConversationContainer;
