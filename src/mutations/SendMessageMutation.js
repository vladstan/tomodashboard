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
    console.log('SendMessageMutation.getVars()');
    return {
      userId: this.props.user._id,
      type: this.props.type,
      text: this.props.text || '',
      imageUrl: this.props.imageUrl || '',
      senderId: this.props.senderId,
      receiverId: this.props.receiverId,
      receiverFacebookId: this.props.receiverFacebookId,
      senderType: this.props.senderType,
      receiverType: this.props.receiverType,
    };
  }

  // getOptimisticResponse() {
  //   return {
  //     messageEdge: {
  //       node: {
  //         type: this.props.type,
  //         text: this.props.text || '',
  //         senderId: this.props.senderId,
  //         receiverId: this.props.receiverId,
  //         senderType: this.props.senderType,
  //         receiverType: this.props.receiverType,
  //         timestamp: Date.now(),
  //         imageUrl: this.props.imageUrl || '',
  //       },
  //     },
  //     user: this.props.user,
  //   };
  // }

}

export default SendMessageMutation;
