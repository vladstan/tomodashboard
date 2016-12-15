import debug from 'debug';

import React from 'react';
import Relay from 'react-relay';
import {routerShape} from 'react-router';

import {
  Row,
  Col,
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

// import ChatConversation from '../components/chat/ChatConversation';
import ChatUserProfileSidebar from '../components/chat/ChatUserProfileSidebar';
import AgentPlannerSidebar from '../components/planner/AgentPlannerSidebar';

import SwitchBotAgentMutation from '../mutations/SwitchBotAgentMutation';

const log = debug('tomo:chat:UserChat');

class UserChat extends React.Component {

  static contextTypes = {
    relay: Relay.PropTypes.Environment,
    router: routerShape.isRequired,
  }

  static propTypes = {
    userId: React.PropTypes.string.isRequired, // relay variable
    plannerTripId: React.PropTypes.string, // relay variable
    agent: React.PropTypes.object.isRequired,
  }

  handleSwitchBotAgent(botMuted) {
    const {relay} = this.context;
    const {agent} = this.props;
    const {user} = agent;
    const switchMutation = new SwitchBotAgentMutation({user, agent, botMuted});
    relay.commitUpdate(switchMutation, {
      onSuccess: () => log('successfully switched bot to muted=' + botMuted),
      onFailure: (err) => {
        alert('Could not switch bot. Please try again.');
        console.error(err);
      },
    });
  }

  render() {
    const {botMuted} = this.props.agent.user;

    const switchBotStyle = botMuted ? undefined : 'blue';
    const switchAgentStyle = botMuted ? 'blue' : undefined;

    return (
      <PanelContainer className='inbox' collapseBottom>
        <Panel>
          <PanelBody style={{paddingTop: 0}}>
            <Grid>
              <Row>
                <Col xs={8} style={{paddingTop: 12.5, paddingBottom: 20.5}}>
                  <ButtonToolbar className='inbox-toolbar'>
                    <ButtonGroup>
                      <Button bsStyle={switchBotStyle} onClick={this.handleSwitchBotAgent.bind(this, false)}>Bot</Button>
                      <Button bsStyle={switchAgentStyle} onClick={this.handleSwitchBotAgent.bind(this, true)}>Agent</Button>
                    </ButtonGroup>
                  </ButtonToolbar>
                </Col>
              </Row>
            </Grid>
            <hr style={{margin: 0}}/>
            <Panel horizontal>
              <PanelLeft className='panel-sm-3 inbox-nav'>
                <Grid>
                  <Row>
                    <Col xs={12}>
                      <ChatUserProfileSidebar user={this.props.agent.user} />
                    </Col>
                  </Row>
                </Grid>
              </PanelLeft>
              <PanelBody className='panel-sm-6 panel-xs-12' style={{ paddingTop: 0 }}>
                <Grid>
                  <Row>
                    <Col xs={12}>
                      {/* <ChatConversation user={this.props.agent.user} agent={this.props.agent} /> */}
                    </Col>
                  </Row>
                </Grid>
              </PanelBody>
              <PanelRight className='panel-sm-3 inbox-nav'>
                <Grid>
                  <Row>
                    <Col xs={12}>
                      <AgentPlannerSidebar
                        user={this.props.agent.user}
                        agent={this.props.agent}
                        plannerTripId={this.props.plannerTripId} />
                    </Col>
                  </Row>
                </Grid>
              </PanelRight>
            </Panel>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}

const UserChatContainer = Relay.createContainer(UserChat, {
  initialVariables: {
    userId: null,
    plannerTripId: null,
  },
  fragments: {
    agent: ({plannerTripId}) => Relay.QL`
      fragment on Agent {
        user(_id: $userId) {
          ${ChatUserProfileSidebar.getFragment('user')}
          ${AgentPlannerSidebar.getFragment('user', {plannerTripId})}
        }

        ${SwitchBotAgentMutation.getFragment('agent')}
        ${AgentPlannerSidebar.getFragment('agent', {plannerTripId})}
      }
    `,
  },
});

//
// ${ChatConversation.getFragment('user')}
//
//         ${ChatConversation.getFragment('agent')}

export default UserChatContainer;

// fragment on Agent {
//   _id
//   name
//   pictureUrl
//   lastReadWatermark
//   lastDeliveredWatermark
//   ${SwitchBotAgentMutation.getFragment('agent')}
//   ${UpdateAgentWatermarksMutation.getFragment('agent')}
//   ${UpdateAgentTypingStatusMutation.getFragment('agent')}

// user: () => Relay.QL`
//   fragment on User {
//     id
//     _id
//     facebookId
//     botMuted
//     lastReadWatermark
//     lastDeliveredWatermark
//     ${AddMessageSubscription.getFragment('user')}
//     ${UpdateUserSubscription.getFragment('user')}
//     ${SendMessageMutation.getFragment('user')}
//     ${SwitchBotAgentMutation.getFragment('user')}
//     ${UpdateAgentWatermarksMutation.getFragment('user')}
//     ${UpdateAgentTypingStatusMutation.getFragment('user')}
//

//
//     messages(first: 1000) {
//       edges {
//         node {
//           id
//           _id
//           type
//           text
//           cards
//           senderId
//           receiverId
//           senderType
//           receiverType
//           timestamp
//           imageUrl
//         }
//       }
//     }
//
//     ${AgentPlannerSidebar.getFragment('user')}
//   }
// `,

// sendMessage(messageText) {
//   console.log('new SendMessageMutation({');
//   const { relay, user, agent } = this.props;
//   relay.commitUpdate(
//     new SendMessageMutation({
//       user,
//       type: 'text',
//       text: messageText,
//       senderId: agent._id,
//       receiverId: user._id,
//       receiverFacebookId: user.facebookId,
//       senderType: 'agent',
//       receiverType: 'user',
//     }),
//     {onFailure: ::console.error}
//   );
// }
//
// sendImageMessage(link) {
//   // console.log('sendImageMessage:', link);
//   const { relay, user, agent } = this.props;
//   relay.commitUpdate(
//     new SendMessageMutation({
//       user,
//       type: 'image',
//       imageUrl: link,
//       senderId: agent._id,
//       receiverId: user._id,
//       receiverFacebookId: user.facebookId,
//       senderType: 'agent',
//       receiverType: 'user',
//     }),
//     {onFailure: ::console.error}
//   );
// }
