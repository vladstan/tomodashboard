import Relay from 'react-relay';

class CreateTripMutation extends Relay.Mutation {

  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
        _id
      }
    `,
    agent: () => Relay.QL`
      fragment on Agent {
        id
        _id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation { createTrip }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateTripPayload {
        tripEdge
        user {
          trips
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.user.id,
      connectionName: 'trips',
      edgeName: 'tripEdge',
      rangeBehaviors: () => 'append',
    }];
  }

  getVariables() {
    return {
      userId: this.props.user._id,
      agentId: this.props.agent._id,
      tripName: this.props.name,
      status: this.props.status,
    };
  }

}

export default CreateTripMutation;
