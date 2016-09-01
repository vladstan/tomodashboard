import Relay from 'react-relay';

const UserChatQueries = {
  user: (Component, variables) => Relay.QL`
    query {}
  `,
};

export default UserChatQueries;
