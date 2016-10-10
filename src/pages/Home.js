import React, {PropTypes} from 'react';
// import Relay from 'react-relay';

import { withRouter } from 'react-router';

@withRouter
class Home extends React.Component {
  static propTypes = {
    user: PropTypes.object
  }

  render() {
    return (
      <div>
        <p>This is our dashboard site</p>
        <ul class="nav nav-pills">
          <li role="presentation" class="active"><a href="/landing">Laning Page</a></li>
          <li role="presentation"><a href="/dashboard">Agent Dashboard</a></li>
        </ul>
        <br />
        <p>Previous samples </p>
        <ul>
          <li role="presentation"><a href="https://s3-us-west-1.amazonaws.com/ta.helloyago.com/anastasiia.html">Agent Page</a></li>
          <li role="presentation"><a href="https://s3-us-west-1.amazonaws.com/sampletrip.yago.com/costarica.html">Offer Page</a></li>
        </ul>
      </div>
    );
  }
}

// const Container = Relay.createContainer(Home, {
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

export default Home;
