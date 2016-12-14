import React from 'react';
// import Relay from 'react-relay';

class DashboardHome extends React.Component {

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
