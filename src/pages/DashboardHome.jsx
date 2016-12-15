import React from 'react';
// import Relay from 'react-relay';

class DashboardHome extends React.Component {

  render() {
    return (
      <p style={{marginLeft: 30}}>
        Welcome to your dashboard! Have a look at the requests on the left sidebar :)
      </p>
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
