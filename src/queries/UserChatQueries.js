import Relay from 'react-relay';

const UserChatQuery = {
  user: (Component, variables) => Relay.QL`
    query {
      user {
        ${Component.getFragment('user', {...variables})}
      }
    }
  `,
};

export default UserChatQuery;
