import Relay from 'react-relay';

const DashboardQueries = {
  agent: (Component, variables) => Relay.QL`
    query {
      agent(token: $authToken) {
        ${Component.getFragment('agent', {...variables})}
      }
    }
  `,
};

export default DashboardQueries;
