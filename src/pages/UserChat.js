import React from 'react';
import { withRouter } from 'react-router';
import Promise from 'bluebird';

import Relay from 'react-relay';
import RelaySubscriptions from 'relay-subscriptions';

import AddMessageSubscription from '../subscriptions/AddMessageSubscription';
import UpdateUserSubscription from '../subscriptions/UpdateUserSubscription';

import SendMessageMutation from '../mutations/SendMessageMutation';
import SwitchBotAgentMutation from '../mutations/SwitchBotAgentMutation';
import GetSummaryLinkMutation from '../mutations/GetSummaryLinkMutation';
import UpdateAgentWatermarksMutation from '../mutations/UpdateAgentWatermarksMutation';
import UpdateAgentTypingStatusMutation from '../mutations/UpdateAgentTypingStatusMutation';

import {
  Row,
  Col,
  Icon,
  Grid,
  Panel,
  Button,
  PanelLeft,
  PanelRight,
  PanelBody,
  ButtonGroup,
  ButtonToolbar,
  PanelContainer,
} from '@sketchpixy/rubix';

import ChatConversation from '../components/ChatConversation';
import ChatUserProfileSidebar from '../components/ChatUserProfileSidebar';

@withRouter
class UserChat extends React.Component {

  sendMessage(messageText) {
    const { relay, user } = this.props;
    relay.commitUpdate(
      new SendMessageMutation({
        user,
        type: 'text',
        text: messageText,
        senderId: '00agent00',
        receiverId: user._id,
        receiverFacebookId: user.facebookId,
        senderType: 'bot',
        receiverType: 'user',
      }),
    );
  }

  sendImageMessage(link) {
    // console.log('sendImageMessage:', link);
    const { relay, user } = this.props;
    relay.commitUpdate(
      new SendMessageMutation({
        user,
        type: 'image',
        imageUrl: link,
        senderId: '00agent00',
        receiverId: user._id,
        receiverFacebookId: user.facebookId,
        senderType: 'bot',
        receiverType: 'user',
      }),
    );
  }

  sendSuggestionsMessage(suggestions, sType) {
    console.log('sendSuggestionsMessage:', suggestions, sType);
    let cards = [];

    const fixedCards = Object.keys(suggestions.cards)
      .map(key => suggestions.cards[key]);

    if (sType === 'accommodation') {
      cards = fixedCards.map((c) => ({
        link: c.link,
        description: c.description,
      }));
    }

    if (sType === 'flights') {
      cards = fixedCards.map((c) => ({
        link: c.link,
        title: c.title,
        description: c.description,
      }));
    }

    const { relay, user } = this.props;
    try {
      console.log('commiting: ', {
        user,
        type: 'cards',
        cards: JSON.stringify(cards),
        senderId: '00agent00',
        receiverId: user._id,
        receiverFacebookId: user.facebookId,
        senderType: 'bot',
        receiverType: 'user',
        sType,
      });
      relay.commitUpdate(
        new SendMessageMutation({
          user,
          type: 'cards',
          cards: JSON.stringify(cards),
          senderId: '00agent00',
          receiverId: user._id,
          receiverFacebookId: user.facebookId,
          senderType: 'bot',
          receiverType: 'user',
          sType,
        }),
      );
    } catch (ex) {
      console.error(ex);
    }
  }

  getSummaryLink(summary) {
    return new Promise((resolve, reject) => {
      try {
        const onFailure = (transaction) => {
          // console.log('getSummaryLink FAILURE:', transaction);
          reject(transaction.getError());
        };

        const onSuccess = (response) => {
          // console.log('getSummaryLink SUCCESS', response);
          resolve(response.getSummaryLink.link);
        };

        const { relay, agent, user } = this.props;
        relay.commitUpdate(
          new GetSummaryLinkMutation({
            summary,
            agent,
            user,
          }),
          {onSuccess, onFailure}
        );
      } catch (ex) {
        console.error('unexpected error 👀', ex);
      }
    }).catch(console.error.bind(console, 'grrrr promise err'));
  }

  handleSwitch(currentState) {
    const { relay, user, agent } = this.props;
    relay.commitUpdate(
      new SwitchBotAgentMutation({
        user,
        botMuted: currentState !== 'bot',
        agent,
      }),
    );
  }

  render() {
    // console.log('render user:', this.props.user);

    const user = this.props.user;

    const switchBotStyle = user.botMuted ? undefined : 'blue';
    const switchAgentStyle = user.botMuted ? 'blue' : undefined;

    return (
      <div>
        <PanelContainer className='inbox' collapseBottom>
          <Panel>
            <PanelBody style={{paddingTop: 0}}>
              <Grid>
                <Row>
                  <Col xs={8} style={{paddingTop: 12.5, paddingBottom: 20.5}}>
                    <ButtonToolbar className='inbox-toolbar'>
                      <ButtonGroup>
                        <Button bsStyle='blue'>
                          <Icon glyph='icon-fontello-edit-1'/>
                        </Button>
                      </ButtonGroup>
                      <ButtonGroup>
                        <Button outlined onlyOnHover bsStyle='darkgreen45'><Icon glyph='icon-fontello-reply'/></Button>
                        <Button outlined onlyOnHover bsStyle='darkgreen45' className='hidden-xs'><Icon glyph='icon-fontello-reply-all-1'/></Button>
                        <Button outlined onlyOnHover bsStyle='darkgreen45'><Icon glyph='icon-fontello-forward'/></Button>
                      </ButtonGroup>
                      <ButtonGroup className='hidden-xs'>
                        <Button outlined onlyOnHover bsStyle='danger' className='text-center'><Icon glyph='icon-fontello-attention-alt'/></Button>
                        <Button outlined onlyOnHover bsStyle='danger'><Icon glyph='icon-fontello-trash-1'/></Button>
                      </ButtonGroup>
                  	  <ButtonGroup>
                    		<Button bsStyle={switchBotStyle} onClick={this.handleSwitch.bind(this, 'bot')}>Bot</Button>
                    		<Button bsStyle={switchAgentStyle} onClick={this.handleSwitch.bind(this, 'agent')}>Agent</Button>
                  	  </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                  <Col xs={4} className='text-right'>
                    {/* <div className='inbox-avatar'>
                      <img src='/imgs/app/avatars/avatar0.png' width='40' height='40' />
                      <div className='inbox-avatar-name hidden-xs hidden-sm'>
                        <div>Anna Sanchez</div>
                        <div><small>Mailbox</small></div>
                      </div>
                    </div> */}
                  </Col>
                </Row>
              </Grid>
              <hr style={{margin: 0}}/>
              <Panel horizontal>
                <PanelLeft className='panel-sm-3 inbox-nav hidden-xs'>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        <ChatUserProfileSidebar user={this.props.user} />
                      </Col>
                    </Row>
                  </Grid>
                </PanelLeft>
                <PanelBody className='panel-sm-6 panel-xs-12' style={{ paddingTop: 0 }}>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        <ChatConversation
                          messages={this.props.user.messages.edges.map(e => e.node)}
                          profile={this.props.user.profile}
                          sendMessage={::this.sendMessage}
                          sendImageMessage={::this.sendImageMessage}
                          sendSuggestionsMessage={::this.sendSuggestionsMessage}
                          getSummaryLink={::this.getSummaryLink}
                          relay={this.props.relay}
                          user={this.props.user}
                          agent={this.props.agent} />
                      </Col>
                    </Row>
                  </Grid>
                </PanelBody>
                <PanelRight className='panel-sm-3 inbox-nav hidden-xs'>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        <ChatUserProfileSidebar user={this.props.user} />
                      </Col>
                    </Row>
                  </Grid>
                </PanelRight>
              </Panel>
            </PanelBody>
          </Panel>
        </PanelContainer>
      </div>
    );
  }
}

const UserChatContainer = RelaySubscriptions.createContainer(UserChat, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id
        _id
        facebookId
        botMuted
        lastReadWatermark
        lastDeliveredWatermark
        ${AddMessageSubscription.getFragment('user')}
        ${UpdateUserSubscription.getFragment('user')}
        ${SendMessageMutation.getFragment('user')}
        ${SwitchBotAgentMutation.getFragment('user')}
        ${GetSummaryLinkMutation.getFragment('user')}
        ${UpdateAgentWatermarksMutation.getFragment('user')}
        ${UpdateAgentTypingStatusMutation.getFragment('user')}
        profile {
          name
          pictureUrl
          locale
          timezone
          gender
          prefs {
            home_airport
            accommodation
            accommodation_budget
            accommodation_budget_currency
            flight_cabin
            flight_seat
            next_trip_type
            next_trip_destination
            next_trip_time
            next_trip_purpose
            next_trip_extra
          }
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
            }
          }
        }
      }
    `,
    agent: () => Relay.QL`
      fragment on Agent {
        name
        pictureUrl
        lastReadWatermark
        lastDeliveredWatermark
        ${SwitchBotAgentMutation.getFragment('agent')}
        ${GetSummaryLinkMutation.getFragment('agent')}
        ${UpdateAgentWatermarksMutation.getFragment('agent')}
        ${UpdateAgentTypingStatusMutation.getFragment('agent')}
      }
    `,
  },
  subscriptions: [
    ({user}) => new AddMessageSubscription({user}),
    ({user}) => new UpdateUserSubscription({user}),
  ],
});

export default UserChatContainer;
