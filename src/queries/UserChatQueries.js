import Relay from 'react-relay';

const UserChatQueries = {
  user: (Component, variables) => Relay.QL`
    query {
      user {
        ${Component.getFragment('user', {...variables})}
      }
    }
  `,
};

export default UserChatQueries;
