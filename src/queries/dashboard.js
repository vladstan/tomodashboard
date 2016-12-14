import Relay from 'react-relay';

export default {
  agent: (Component, variables) => Relay.QL`
    query {
      agent(token: $accessToken) {
        ${Component.getFragment('agent', {...variables})}
      }
    }
  `,
};
