import Relay from 'react-relay';

class UpdateAgentTypingStatusMutation extends Relay.Mutation {

  static fragments = {
    agent: () => Relay.QL`
      fragment on Agent {
        id
        _id
      }
    `,
    user: () => Relay.QL`
      fragment on User {
        id
        _id
        facebookId
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation { updateAgentTypingStatus }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateAgentTypingStatusPayload {
        agent {
          id
        }
      }
    `; // whatever
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        // agent: this.props.agent.id,
      },
    }];
  }

  getVariables() {
    return {
      userFacebookId: this.props.user.facebookId,
      agentId: this.props.agent._id,
      isTyping: this.props.isTyping,
    };
  }

}

export default UpdateAgentTypingStatusMutation;
