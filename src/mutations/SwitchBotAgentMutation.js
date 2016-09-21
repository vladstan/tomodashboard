import Relay from 'react-relay';

class SwitchBotAgentMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
        _id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation { switchBotAgent }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SwitchBotAgentPayload @relay(pattern: true) {
        user {
          id
          _id
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

export default SwitchBotAgentMutation;
