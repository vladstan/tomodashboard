import Relay from 'react-relay';

class UpdateAgentWatermarksMutation extends Relay.Mutation {

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
    return Relay.QL`mutation { updateAgentWatermarks }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateAgentWatermarksPayload {
        agent {
          lastReadWatermark
          lastDeliveredWatermark
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        agent: this.props.agent.id,
      },
    }];
  }

  getVariables() {
    return {
      userFacebookId: this.props.user.facebookId,
      agentId: this.props.agent._id,
      lastReadWatermark: this.props.lastReadWatermark, // string
    };
  }

}

export default UpdateAgentWatermarksMutation;
