import React from 'react';

import Relay from 'react-relay';
import RelaySubscriptions from 'relay-subscriptions';

import {
  Form,
  FormGroup,
  FormControl,
  Button,
} from '@sketchpixy/rubix';

import UpdateTripMutation from '../../mutations/planner/UpdateTripMutation';

class EditTripSidebar extends React.Component {

  state = {
    isLoading: false,
    tripName: '',
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

  render() {
    try {
      const trip = this.props.trip;
      return (
        <div className="new-trip">
          <p className="page-title"><a onClick={this.props.goToTripsList}>&lt;</a> Edit Trip</p>
          <Form horizontal>
          	<FormGroup controlId="formHorizontalEmail">
              <p>Trip name</p>
              <FormControl
                type="text"
                value={this.state.tripName || trip.name}
                onChange={this.onFieldChange.bind(this, 'tripName')} />
          	</FormGroup>

          	{/* <FormGroup controlId="formHorizontalPassword">
              <p>Trip nickname</p>
          	  <FormControl type="text" value="Awesome Adventure 2" />
          	</FormGroup> */}

          	<FormGroup>
              <Button bsStyle="success" onClick={::this.handleSave} disabled={this.state.isLoading}>
                {this.state.isLoading ? 'Saving...' : 'Save'}
              </Button>
          	</FormGroup>
          </Form>
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
        name
      }
    `,
  },
  subscriptions: [
    // subscribe to changes?
  ],
});

export default EditTripSidebarContainer;
