import React, {PropTypes} from 'react';
// import Relay from 'react-relay';

class Home extends React.Component {
  static propTypes = {
    user: PropTypes.object
  }

  render() {
    return (
      <div>
        <p>This is our dashboard site</p>
        <ul className="nav nav-pills">
          <li role="presentation" className="active"><a href="/landing">Landing Page</a></li>
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
