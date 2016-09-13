import React, {PropTypes} from 'react';
import Relay from 'react-relay';

class Home extends React.Component {
  static propTypes = {
    user: PropTypes.object
  }

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
