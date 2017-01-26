import debug from 'debug';

import React from 'react';
import Relay from 'react-relay';

import {
  Icon,
  Form,
  FormGroup,
  FormControl,
  Button,
  Media,
} from '@sketchpixy/rubix';

import FlightsSuggestionsModal from './modals/FlightsSuggestionsModal';
import AccommodationSuggestionsModal from './modals/AccommodationSuggestionsModal';
import ActivitiesSuggestionsModal from './modals/ActivitiesSuggestionsModal';
import SummaryModal from './modals/SummaryModal';

import UpdateTripMutation from '../../mutations/planner/UpdateTripMutation';
import GetSummaryLinkMutation from '../../mutations/planner/GetSummaryLinkMutation';
import SendMessageMutation from '../../mutations/chat/SendMessageMutation';

const log = debug('tomo:planner:EditTripSidebar');

class EditTripSidebar extends React.Component {

  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  }

  static propTypes = {
    goToPage: React.PropTypes.func.isRequired,
    agent: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
  }

  state = {
    isLoading: false,
    tripName: '',
    showFlightSuggestionsModal: false,
    showAccommodationSuggestionsModal: false,
    showActivitiesSuggestionsModal: false,
    showSummaryModal: false,
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
      this.props.goToPage('viewTrips');
    };

    const {relay} = this.context;
    const {trip} = this.props.user;
    relay.commitUpdate(
      new UpdateTripMutation({
        trip,
        name: this.state.tripName,
      }),
      {onSuccess, onFailure}
    );
  }

  onFieldChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
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

  getSummaryLink(summary) {
    return new Promise((resolve, reject) => {
      const {relay} = this.context;
      const {agent, user} = this.props;
      const linkMutation = new GetSummaryLinkMutation({summary, agent, user});
      relay.commitUpdate(linkMutation, {
        onSuccess: (transaction) => reject(transaction.getError()),
        onFailure: (response) => resolve(response.getSummaryLink.link),
      });
    });
  }

  sendSuggestionsMessage(sType, suggestions) {
    const fixedCards = Object.keys(suggestions.cards)
      .map((key) => suggestions.cards[key]);
    const cards = fixedCards.map((c) => ({
      link: c.link,
      title: c.title,
      description: c.description,
    }));

    const {user, agent} = this.props;
    this.context.backendApi.sendMessage({ // TODO: use mutation
      userId: user._id,
      type: 'cards',
      cards: JSON.stringify(cards),
      senderId: agent._id,
      receiverId: user._id,
      receiverFacebookId: user.facebookId,
      senderType: 'agent',
      receiverType: 'user',
      tripId: user.trip._id,
      sType,
    });
  }

  sendSummaryLink(link) {
    const {user, agent} = this.props;
    this.context.backendApi.sendMessage({ // TODO: use mutation
      userId: user._id,
      type: 'text',
      text: link,
      senderId: agent._id,
      receiverId: user._id,
      receiverFacebookId: user.facebookId,
      senderType: 'agent',
      receiverType: 'user',
    });
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

  newSummary() {
    this.openModal('showSummaryModal');
  }

  onBackClick() {
    this.props.goToPage('viewTrips');
  }

  render() {
    const {trip} = this.props.user;

    const flights = trip.flights.edges.map((e) => e.node);
    const accommodation = trip.accommodation.edges.map((e) => e.node);
    const activities = trip.activities.edges.map((e) => e.node);

    return (
      <div className="new-trip">
        <p className="page-title"><a onClick={::this.onBackClick}>&lt;</a> Edit Trip</p>
        <Form horizontal>
          <FormGroup>
            <p>Trip name</p>
            <FormControl
              type="text"
              value={this.state.tripName || trip.name}
              name="tripName"
              onChange={::this.onFieldChange} />
          </FormGroup>

          <FormGroup>
            <p>Flights</p>

            {flights.map((flight) => (
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

            {accommodation.map((place) => (
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

            {activities.map((activity) => (
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
            <a onClick={::this.newSummary} style={{cursor: 'pointer'}} title="Send summary">
              <Icon glyph='icon-dripicons-align-justify icon-1-and-quarter-x fg-text' />
            </a>
            <Button bsStyle="success" onClick={::this.handleSave} disabled={this.state.isLoading}>
              {this.state.isLoading ? 'Saving...' : 'Save'}
            </Button>
          </FormGroup>
        </Form>

        <FlightsSuggestionsModal
          show={this.state.showFlightsSuggestionsModal}
          onClose={this.closeModal.bind(this, 'showFlightsSuggestionsModal')}
          sendSuggestionsMessage={this.sendSuggestionsMessage.bind(this, 'flights')} />

        <AccommodationSuggestionsModal
          show={this.state.showAccommodationSuggestionsModal}
          onClose={this.closeModal.bind(this, 'showAccommodationSuggestionsModal')}
          sendSuggestionsMessage={this.sendSuggestionsMessage.bind(this, 'accommodation')} />

        <ActivitiesSuggestionsModal
          show={this.state.showActivitiesSuggestionsModal}
          onClose={this.closeModal.bind(this, 'showActivitiesSuggestionsModal')}
          sendSuggestionsMessage={this.sendSuggestionsMessage.bind(this, 'activities')} />

        <SummaryModal
          show={this.state.showSummaryModal}
          onClose={this.closeModal.bind(this, 'showSummaryModal')}
          sendLink={::this.sendSummaryLink}
          getSummaryLink={::this.getSummaryLink} />
      </div>
    );
  }

}

const EditTripSidebarContainer = Relay.createContainer(EditTripSidebar, {
  initialVariables: {
    tripId: null,
  },
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        _id
        facebookId

        ${SendMessageMutation.getFragment('user')}
        ${GetSummaryLinkMutation.getFragment('user')}

        trip(_id: $tripId) {
          _id
          name

          ${UpdateTripMutation.getFragment('trip')}

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
      }
    `,
    agent: () => Relay.QL`
      fragment on Agent {
        _id
        ${GetSummaryLinkMutation.getFragment('agent')}
      }
    `,
  },
});

export default EditTripSidebarContainer;
