import Relay from 'react-relay';

const DashboardQueries = {
  user: (Component, variables) => Relay.QL`
    query {
      user(_id: "57b19661ea7338f8003ecf56") {
        ${Component.getFragment('user', {...variables})}
      }
    }
  `,
};

export default DashboardQueries;
