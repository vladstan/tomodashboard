import Relay from 'react-relay';

class UpdateStripeDetailsMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
        _id
        profile {
          firstName
          lastName
        }
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
      user: this.props.user,
      token: JSON.stringify(this.props.token),
      name: this.props.user.profile.firstName + ' ' + this.props.user.profile.lastName
    };
  }

}

export default UpdateStripeDetailsMutation;
