import Relay from 'react-relay';

const SummaryPageQueries = {
  user: (Component, variables) => Relay.QL`
    query {
      user(_id: "5800a5960b1b8eff15c69469") {
        ${Component.getFragment('user', {...variables})}
      }
    }
  `,
};

export default SummaryPageQueries;
