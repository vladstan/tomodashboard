import Relay from 'react-relay';

class GetSummaryLinkMutation extends Relay.Mutation {

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
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation { getSummaryLink }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on GetSummaryLinkPayload {
        link
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [Relay.QL`
        fragment on GetSummaryLinkPayload {
          link
        }
      `],
    }];
  }

  getVariables() {
    // console.log('sending stringified summ', JSON.stringify(this.props.summary));
    return {
      summary: JSON.stringify(this.props.summary),
      agentId: this.props.agent._id,
      userId: this.props.user._id,
    };
  }

}

export default GetSummaryLinkMutation;
