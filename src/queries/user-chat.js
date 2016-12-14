import Relay from 'react-relay';

export default {
  user: (Component, variables) => Relay.QL`
    query {
      user(_id: $uid) {
        ${Component.getFragment('user', {...variables})}
      }
    }
  `,
  agent: (Component, variables) => Relay.QL`
    query {
      agent(token: $authToken) {
        ${Component.getFragment('agent', {...variables})}
      }
    }
  `,
};
