import Relay from 'react-relay';

const TestQueries = {
  user: (Component, variables) => {
    console.log('TestQueries', Component, variables);
    return Relay.QL`
      query {
        user(id: "57b19661ea7338f8003ecf56") {
          ${Component.getFragment('user', {...variables, _testQueriesVarTest: 5})}
        }
      }
    `;
  },
};

export default TestQueries;
