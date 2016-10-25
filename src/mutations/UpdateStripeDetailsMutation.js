import Relay from 'react-relay';

class UpdateStripeDetailsMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
        _id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation { updateStripeDetails }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateStripeDetailsPayload @relay(pattern: true) {
        user {
          id
          _id
          stripe {
            customerId
          }
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
      stripe_customerId: this.props.stripeDetails.id,
      // stripe_email etc
    };
  }

  // getOptimisticResponse() {
  //   return {
  //     // FIXME: totalCount gets updated optimistically, but this edge does not
  //     // get added until the server responds
  //     messageEdge: {
  //       node: {
  //         id
  //         _id
  //         type
  //         text
  //         senderId
  //         receiverId
  //         senderType
  //         receiverType
  //         text: this.props.text,
  //       },
  //     },
  //     user: {
  //       id: .id,
  //       totalCount: this.props.viewer.totalCount + 1,
  //     },
  //   };
  // }
}

export default UpdateStripeDetailsMutation;
