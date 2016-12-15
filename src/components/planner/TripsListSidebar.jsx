import React from 'react';

import Relay from 'react-relay';
import RelaySubscriptions from 'relay-subscriptions';

import {
  ListGroup,
  ListGroupItem,
  Button,
} from '@sketchpixy/rubix';

class TripsListSidebar extends React.Component {

  static propTypes = {
    goToPage: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
  }

  onTripClick(trip) {
    this.props.goToPage('editTrip', {plannerTripId: trip._id});
  }

  onNewTripClick() {
    this.props.goToPage('newTrip');
  }

  render() {
    const trips = this.props.user.trips.edges.map((e) => e.node);
    return (
      <div className="trips-list">
        <p className="page-title">Trips</p>
        <ListGroup>
          {
            trips.map((trip) => (
              <ListGroupItem key={trip.id} onClick={this.onTripClick.bind(this, trip)}>
                <span>{trip.name}</span>
                <br/>
                <small>{trip.status}</small>
              </ListGroupItem>
            ))
          }
        </ListGroup>
        <Button bsStyle="primary" onClick={::this.onNewTripClick}>New Trip</Button>
      </div>
    );
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
            }
          }
        }
      }
    `,
  },
});

export default TripsListSidebarContainer;
