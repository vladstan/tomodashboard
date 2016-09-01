import Relay from 'react-relay';

const TestQueries = {
  user: (Component, variables) => Relay.QL`
    query {
      user(id: "57b19661ea7338f8003ecf56") {
        ${Component.getFragment('user', {...variables})}
      }
    }
  `,
};

export default TestQueries;
