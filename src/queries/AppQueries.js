import Relay from 'react-relay';

const AppQueries = {
  user: (Component, variables) => Relay.QL`
    query {
      user(_id: "5800a5960b1b8eff15c69469") {
        ${Component.getFragment('user', {...variables})}
      }
    }
  `, // TODO: WATCH OUT: hardcoded id
};

export default AppQueries;
