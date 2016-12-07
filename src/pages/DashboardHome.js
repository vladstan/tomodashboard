import React, {PropTypes} from 'react';
// import Relay from 'react-relay';

import { withRouter } from 'react-router';

@withRouter
class DashboardHome extends React.Component {
  static propTypes = {
    user: PropTypes.object
  }

  render() {
    return (
      <div>This is the Dashboard. Still work in Progress.</div>
    );
  }
}

// const Container = Relay.createContainer(DashboardHome, {
//   fragments: {
//     user: () => Relay.QL`
//       fragment on User {
//         id
//         _id
//         profile {
//           id
//           _id
//           userId
//         }
//       }
//     `
//   }
// });

export default DashboardHome;
