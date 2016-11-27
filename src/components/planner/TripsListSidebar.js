import React from 'react';

import Relay from 'react-relay';
import RelaySubscriptions from 'relay-subscriptions';

import {
  ListGroup,
  ListGroupItem,
  Button,
} from '@sketchpixy/rubix';

import EditTripSidebar from './EditTripSidebar';

class TripsListSidebar extends React.Component {

  onTripClick(trip) {
    this.props.goToEditTrip(trip);
  }

  render() {
    try {
      const trips = this.props.user.trips.edges.map(e => e.node);
      return (
        <div className="trips-list">
          <p className="page-title">Trips</p>
          <ListGroup>
            {
              trips.map(trip => (
                <ListGroupItem key={trip.id} onClick={this.onTripClick.bind(this, trip)}>
                  {trip.name}
                  <br/>
                  <small>{trip.status}</small>
                </ListGroupItem>
              ))
            }
        	</ListGroup>
          <Button bsStyle="primary" onClick={this.props.goToNewTrip}>New Trip</Button>
        </div>
      );
    } catch (ex) {
      console.error('TripsList', ex);
    }
  }

}

const TripsListSidebarContainer = RelaySubscriptions.createContainer(TripsListSidebar, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        trips(first: 1000) {
          edges {
            node {
              id
              _id
              status
              name
              agentId
              userId

              ${EditTripSidebar.getFragment('trip')}
            }
          }
        }
      }
    `,
  },
});

export default TripsListSidebarContainer;
