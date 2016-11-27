import React from 'react';

import Relay from 'react-relay';
import RelaySubscriptions from 'relay-subscriptions';

import {
  Form,
  FormGroup,
  FormControl,
  Button,
} from '@sketchpixy/rubix';

import CreateTripMutation from '../../mutations/planner/CreateTripMutation';

class NewTripSidebar extends React.Component {

  state = {
    isLoading: false,
    tripName: 'Awesome Adventure',
    status: 'draft',
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

    const { relay, agent, user } = this.props;
    relay.commitUpdate(
      new CreateTripMutation({
        agent,
        user,
        name: this.state.tripName,
        status: this.state.status,
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
      return (
        <div className="new-trip">
          <p className="page-title"><a onClick={this.props.goToTripsList}>&lt;</a> New Trip</p>
          <Form horizontal>
          	<FormGroup controlId="formHorizontalEmail">
              <p>Trip name</p>
          	  <FormControl
                type="text"
                value={this.state.tripName}
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
      console.error('NewTrip', ex);
    }
  }

}

const NewTripSidebarContainer = RelaySubscriptions.createContainer(NewTripSidebar, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        ${CreateTripMutation.getFragment('user')}
      }
    `,
    agent: () => Relay.QL`
      fragment on Agent {
        ${CreateTripMutation.getFragment('agent')}
      }
    `,
  },
});

export default NewTripSidebarContainer;
