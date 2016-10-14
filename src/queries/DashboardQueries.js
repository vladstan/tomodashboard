import Relay from 'react-relay';

const DashboardQueries = {
  user: (Component, variables) => Relay.QL`
    query {
      user(_id: "5800a5960b1b8eff15c69469") {
        ${Component.getFragment('user', {...variables})}
      }
    }
  `,
};

export default DashboardQueries;
