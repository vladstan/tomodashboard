import React from 'react';

import Relay from 'react-relay';
import RelaySubscriptions from 'relay-subscriptions';

import {
  Form,
  FormGroup,
  FormControl,
  Button,
  Media,
} from '@sketchpixy/rubix';

import FlightsSuggestionsModal from './modals/FlightsSuggestionsModal';
import AccommodationSuggestionsModal from './modals/AccommodationSuggestionsModal';
import ActivitiesSuggestionsModal from './modals/ActivitiesSuggestionsModal';

import UpdateTripMutation from '../../mutations/planner/UpdateTripMutation';
import SendMessageMutation from '../../mutations/SendMessageMutation';

class EditTripSidebar extends React.Component {

  state = {
    isLoading: false,
    tripName: '',
    showFlightSuggestionsModal: false,
    showAccommodationSuggestionsModal: false,
    showActivitiesSuggestionsModal: false,
  }

  handleSave() {
    const onFailure = (transaction) => {
      this.setState({
        ...this.state,
        isLoading: false,
      });
      const err = transaction.getError();
      alert(err);
    };

    const onSuccess = () => {
      this.setState({
        ...this.state,
        isLoading: false,
      });
      this.props.goToTripsList();
    };

    const { relay, trip } = this.props;
    relay.commitUpdate(
      new UpdateTripMutation({
        trip,
        name: this.state.tripName,
      }),
      {onSuccess, onFailure}
    );
  }

  onFieldChange(fieldKey, event) {
    this.setState({
      ...this.state,
      [fieldKey]: event.target.value,
    });
  }

  closeModal(modalKey) {
    this.setState({
      ...this.state,
      [modalKey]: false,
    });
  }

  openModal(modalKey) {
    this.setState({
      ...this.state,
      [modalKey]: true,
    });
  }

  sendFlightsSuggestionsMessage(suggestions) {
    console.log('sendFlightsSuggestionsMessage:', suggestions);

    const fixedCards = Object.keys(suggestions.cards)
      .map(key => suggestions.cards[key]);
    const cards = fixedCards.map((c) => ({
      link: c.link,
      title: c.title,
      description: c.description,
    }));

    const { relay, user, trip } = this.props;
    relay.commitUpdate(
      new SendMessageMutation({
        user,
        type: 'cards',
        cards: JSON.stringify(cards),
        senderId: '00agent00',
        receiverId: user._id,
        receiverFacebookId: user.facebookId,
        senderType: 'bot',
        receiverType: 'user',
        sType: 'flights',
        tripId: trip._id,
      }),
      {onFailure: ::console.error}
    );
  }

  sendAccommodationSuggestionsMessage(suggestions) {
    console.log('sendAccommodationSuggestionsMessage:', suggestions);

    const fixedCards = Object.keys(suggestions.cards)
      .map(key => suggestions.cards[key]);
    const cards = fixedCards.map((c) => ({
      link: c.link,
      description: c.description,
    }));

    const { relay, user, trip } = this.props;
    relay.commitUpdate(
      new SendMessageMutation({
        user,
        type: 'cards',
        cards: JSON.stringify(cards),
        senderId: '00agent00',
        receiverId: user._id,
        receiverFacebookId: user.facebookId,
        senderType: 'bot',
        receiverType: 'user',
        sType: 'accommodation',
        tripId: trip._id,
      }),
      {onFailure: ::console.error}
    );
  }

  sendActivitiesSuggestionsMessage(suggestions) {
    console.log('sendActivitiesSuggestionsMessage:', suggestions);

    const fixedCards = Object.keys(suggestions.cards)
      .map(key => suggestions.cards[key]);
    const cards = fixedCards.map((c) => ({
      link: c.link,
      title: c.title,
      description: c.description,
    }));

    const { relay, user, trip } = this.props;
    console.log('sending activity suggestion for tripId:', trip._id);
    relay.commitUpdate(
      new SendMessageMutation({
        user,
        type: 'cards',
        cards: JSON.stringify(cards),
        senderId: '00agent00',
        receiverId: user._id,
        receiverFacebookId: user.facebookId,
        senderType: 'bot',
        receiverType: 'user',
        sType: 'activities',
        tripId: trip._id,
      }),
      {onFailure: ::console.error}
    );
  }

  newFlight() {
    this.openModal('showFlightsSuggestionsModal');
  }

  newAccommodation() {
    this.openModal('showAccommodationSuggestionsModal');
  }

  newActivity() {
    this.openModal('showActivitiesSuggestionsModal');
  }

  render() {
    try {
      const trip = this.props.trip;
      console.log('trrrrrrip', trip);

      const flights = trip.flights.edges.map(e => e.node);
      const accommodation = trip.accommodation.edges.map(e => e.node);
      const activities = trip.activities.edges.map(e => e.node);

      return (
        <div className="new-trip">
          <p className="page-title"><a onClick={this.props.goToTripsList}>&lt;</a> Edit Trip</p>
          <Form horizontal>
          	<FormGroup>
              <p>Trip name</p>
              <FormControl
                type="text"
                value={this.state.tripName || trip.name}
                onChange={this.onFieldChange.bind(this, 'tripName')} />
          	</FormGroup>

            <FormGroup>
              <p>Flights</p>

              {flights.map(flight => (
                <Media key={flight.id}>
              	  <Media.Left>
              		  <img width={64} height={64} src={flight.pictureUrl} />
              	  </Media.Left>
              	  <Media.Body>
              		  <Media.Heading>{flight.airline}</Media.Heading>
              		  <p>{flight.price}</p>
              	  </Media.Body>
              	</Media>
              ))}

              <div style={{textAlign: 'center'}}>
                <Button onClick={::this.newFlight}>+</Button>
              </div>
          	</FormGroup>

            <FormGroup>
              <p>Accommodation</p>

              {accommodation.map(place => (
                <Media key={place.id}>
              	  <Media.Left>
              		  <img width={64} height={64} src={place.pictureUrl} />
              	  </Media.Left>
              	  <Media.Body>
              		  <Media.Heading>{place.name}</Media.Heading>
              		  <p>{place.price} | <a href={place.link}>link</a></p>
              	  </Media.Body>
              	</Media>
              ))}

              <div style={{textAlign: 'center'}}>
                <Button onClick={::this.newAccommodation}>+</Button>
              </div>
          	</FormGroup>

            <FormGroup>
              <p>Activities</p>

              {activities.map(activity => (
                <Media key={activity.id}>
              	  <Media.Left>
              		  <img width={64} height={64} src={activity.pictureUrl} />
              	  </Media.Left>
              	  <Media.Body>
              		  <Media.Heading>{activity.name}</Media.Heading>
              		  <p>{activity.price}</p>
              	  </Media.Body>
              	</Media>
              ))}

              <div style={{textAlign: 'center'}}>
                <Button onClick={::this.newActivity}>+</Button>
              </div>
          	</FormGroup>

          	<FormGroup>
              <Button bsStyle="success" onClick={::this.handleSave} disabled={this.state.isLoading}>
                {this.state.isLoading ? 'Saving...' : 'Save'}
              </Button>
          	</FormGroup>
          </Form>

          <FlightsSuggestionsModal
            show={this.state.showFlightsSuggestionsModal}
            onClose={this.closeModal.bind(this, 'showFlightsSuggestionsModal')}
            sendSuggestionsMessage={::this.sendFlightsSuggestionsMessage} />

          <AccommodationSuggestionsModal
            show={this.state.showAccommodationSuggestionsModal}
            onClose={this.closeModal.bind(this, 'showAccommodationSuggestionsModal')}
            sendSuggestionsMessage={::this.sendAccommodationSuggestionsMessage} />

          <ActivitiesSuggestionsModal
            show={this.state.showActivitiesSuggestionsModal}
            onClose={this.closeModal.bind(this, 'showActivitiesSuggestionsModal')}
            sendSuggestionsMessage={::this.sendActivitiesSuggestionsMessage} />
        </div>
      );
    } catch (ex) {
      console.error('EditTrip', ex);
    }
  }

}

const EditTripSidebarContainer = RelaySubscriptions.createContainer(EditTripSidebar, {
  fragments: {
    trip: () => Relay.QL`
      fragment on Trip {
        ${UpdateTripMutation.getFragment('trip')}
        _id
        name

        activities(first: 1000) {
          edges {
            node {
              id
              pictureUrl
              name
              price
            }
          }
        }

        accommodation(first: 1000) {
          edges {
            node {
              id
              link
              pictureUrl
              name
              price
            }
          }
        }

        flights(first: 1000) {
          edges {
            node {
              id
              pictureUrl
              airline
              price
            }
          }
        }
      }
    `,
    user: () => Relay.QL`
      fragment on User {
        ${SendMessageMutation.getFragment('user')}
        _id
        facebookId
      }
    `,
  },
  subscriptions: [
    // subscribe to changes?
  ],
});

export default EditTripSidebarContainer;
