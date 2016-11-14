import Relay from 'react-relay';

class UpdateStripeDetailsMutation extends Relay.Mutation {

  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
        _id
        facebookId
        profile {
          firstName
          lastName
        }
      }
    `,
    agent: () => Relay.QL`
      fragment on Agent {
        _id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation { updateStripeDetails }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateStripeDetailsPayload {
        user {
          stripe
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
      userFbId: this.props.user.facebookId,
      agentId: this.props.agent._id,
      agentCreditAmount: this.props.agentCreditAmount,
      token: JSON.stringify(this.props.token),
      amount: this.props.amount,
      summaryId: this.props.summaryId,
      name: this.props.user.profile.firstName + ' ' + this.props.user.profile.lastName
    };
  }

}

export default UpdateStripeDetailsMutation;
