import Relay from 'react-relay';

class UpdateUserWatermarksMutation extends Relay.Mutation {

  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
        _id
        facebookId
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation { updateUserWatermarks }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateUserWatermarksPayload {
        user {
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
        user: this.props.user.id,
      },
    }];
  }

  getVariables() {
    return {
      userFacebookId: this.props.user.facebookId,
      userId: this.props.user._id,
      lastReadWatermark: this.props.lastReadWatermark, // string
    };
  }

}

export default UpdateUserWatermarksMutation;
