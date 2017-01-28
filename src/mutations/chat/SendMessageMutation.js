import Relay from 'react-relay';

class SendMessageMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
        _id
        facebookId
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
    return Relay.QL`mutation { sendMessage }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SendMessagePayload {
        messageEdge
        user {
          id
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
      senderId: this.props.agent._id,
      receiverId: this.props.user._id,
      receiverFacebookId: this.props.user.facebookId,
      senderType: 'agent',
      receiverType: 'user',
      text: this.props.text,          // required for type=text
      imageUrl: this.props.imageUrl,  // required for type=image
      cards: this.props.cards,        // required for type=cards
      sType: this.props.sType,    // optional
      tripId: this.props.tripId,  // optional
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
  // cards: this.props.cards || [],
  //       },
  //     },
  //     user: this.props.user,
  //   };
  // }

}

export default SendMessageMutation;
