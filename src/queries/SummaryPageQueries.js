import Relay from 'react-relay';

const SummaryPageQueries = {
  summary: (Component, variables) => Relay.QL`
    query {
      summary(_id: $sid) {
        ${Component.getFragment('summary', {...variables})}
      }
    }
  `,
};

export default SummaryPageQueries;
