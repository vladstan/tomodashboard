import Relay from 'react-relay';

export default {
  summary: (Component, variables) => Relay.QL`
    query {
      summary(_id: $sid) {
        ${Component.getFragment('summary', {...variables})}
      }
    }
  `,
};
