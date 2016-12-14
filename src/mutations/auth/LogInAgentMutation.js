import Relay from 'react-relay';

class LogInAgentMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { logInAgent }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on LogInAgentPayload {
        accessToken
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [
        Relay.QL`
          fragment on LogInAgentPayload {
            accessToken
          }
        `,
      ],
    }];
  }

  getVariables() {
    return {
      uid: this.props.response.userID,
      name: this.props.response.name,
      email: this.props.response.email,
      pictureUrl: this.props.response.picture.data.url,
      accessToken: this.props.response.accessToken,
      expiresIn: this.props.response.expiresIn,
    };
  }

}

export default LogInAgentMutation;
