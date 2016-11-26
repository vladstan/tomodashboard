import React from 'react';

import {
  Row,
  Col,
  Icon,
  Grid,
  Label,
  Badge,
  ListGroup,
  ListGroupItem,
  Form,
  FormGroup,
  FormControl,
  Button,
  ControlLabel,
} from '@sketchpixy/rubix';

import CreateTripMutation from '../mutations/CreateTripMutation';

class TripsList extends React.Component {

  handleNewTrip() {
    this.props.goToNewTrip();
  }

  onTripClick(trip) {
    alert('clicked: ' + trip.name);
  }

  render() {
    // console.log(this.props.trips);
    try {
      return (
        <div className="trips-list">
          <p className="page-title">Trips</p>
          <ListGroup>
            {
              this.props.trips.map(trip => (
                <ListGroupItem key={trip.id} onClick={this.onTripClick.bind(this, trip)}>
                  {trip.name}
                  <br/>
                  <small>{trip.status}</small>
                </ListGroupItem>
              ))
            }
        	</ListGroup>
          <Button bsStyle="primary" onClick={::this.handleNewTrip}>New Trip</Button>
        </div>
      );
    } catch (ex) {
      console.error('TripsList', ex);
    }
  }

}

class NewTrip extends React.Component {

  state = {
    tripName: 'Awesome Adventure',
    status: 'draft',
  }

  handleGoBack() {
    this.props.goToTripsList();
  }

  handleSave() {
    this.props.createTrip({
      name: this.state.tripName,
      status: this.state.status,
    });
    this.props.goToTripsList();
  }

  onTripNameChange(event) {
    this.setState({
      ...this.state,
      tripName: event.target.value,
    });
  }

  render() {
    try {
      return (
        <div className="new-trip">
          <p className="page-title"><a onClick={::this.handleGoBack}>&lt;</a> New Trip</p>
          <Form horizontal>
          	<FormGroup controlId="formHorizontalEmail">
              <p>Trip name</p>
          	  <FormControl type="text" value={this.state.tripName} onChange={::this.onTripNameChange} />
          	</FormGroup>

          	{/* <FormGroup controlId="formHorizontalPassword">
              <p>Trip nickname</p>
          	  <FormControl type="text" value="Awesome Adventure 2" />
          	</FormGroup> */}

          	<FormGroup>
              <Button onClick={::this.handleSave}>Save</Button>
          	</FormGroup>
          </Form>
        </div>
      );
    } catch (ex) {
      console.error('NewTrip', ex);
    }
  }

}

class AgentPlannerSidebar extends React.Component {

  state = {
    pageIndex: 0,
  }

  goToNewTrip() {
    this.setState({
      ...this.state,
      pageIndex: 1,
    });
  }

  goToTripsList() {
    this.setState({
      ...this.state,
      pageIndex: 0,
    });
  }

  createTrip(data) {
    const { relay, agent, user } = this.props;
    relay.commitUpdate(
      new CreateTripMutation({
        agent,
        user,
        data,
      }),
    );
  }

  render() {
    const trips = this.props.user.trips.edges.map(e => e.node);

    try {
      return (
        <div className="planner-container">
          {this.state.pageIndex === 0 && <TripsList goToNewTrip={::this.goToNewTrip} trips={trips} />}
          {this.state.pageIndex === 1 && <NewTrip goToTripsList={::this.goToTripsList} createTrip={::this.createTrip} />}
        </div>
      );
    } catch (ex) {
      console.error('agentPlannerSidebarComp', ex);
    }
  }

}

export default AgentPlannerSidebar;
