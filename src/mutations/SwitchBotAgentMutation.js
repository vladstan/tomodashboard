import Relay from 'react-relay';

class SwitchBotAgentMutation extends Relay.Mutation {

  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
        _id
        facebookId
      }
    `,
    agent: () => Relay.QL`
      fragment on Agent {
        name
        pictureUrl
        largePictureUrl
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation { switchBotAgent }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SwitchBotAgentPayload {
        user {
          botMuted
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      },
    }];
  }

  getVariables() {
    return {
      userId: this.props.user._id,
      botMuted: this.props.botMuted,
      agentName: this.props.agent.name,
      userFbId: this.props.user.facebookId,
      agentImageUrl: this.props.agent.largePictureUrl,
    };
  }

  getOptimisticResponse() {
    return {
      user: {
        botMuted: this.props.botMuted,
      },
    };
  }

}

export default SwitchBotAgentMutation;
