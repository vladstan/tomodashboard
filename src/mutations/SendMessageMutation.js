import Relay from 'react-relay';

class SendMessageMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
        _id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation { sendMessage }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SendMessagePayload {
        messageEdge
        user {
          id
          _id
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.user.id,
      connectionName: 'messages',
      edgeName: 'messageEdge',
      rangeBehaviors: () => 'append',
    }];
  }

  getVariables() {
    return {
      userId: this.props.user._id,
      type: this.props.type,
      text: this.props.text,
      senderId: this.props.senderId,
      receiverId: this.props.receiverId,
      receiverFacebookId: this.props.receiverFacebookId,
      senderType: this.props.senderType,
      receiverType: this.props.receiverType,
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

export default SendMessageMutation;
