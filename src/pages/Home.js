import React from 'react';
import Relay from 'react-relay';

class Home extends React.Component {
  render() {
    return (
      <div>Here is the content for Agent Smith: {JSON.stringify(this.props.user || null)}</div>
    );
  }
}

const Container = Relay.createContainer(Home, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id
        _id
        profile {
          id
          _id
          userId
        }
      }
    `
  }
});

export default Container;
