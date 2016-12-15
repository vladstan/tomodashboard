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
      this.props.goToPage('viewTrips');
    };

    const {relay} = this.context;
    const {agent, user} = this.props;
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

  onFieldChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
  }

  onBackClick() {
    this.props.goToPage('viewTrips');
  }

  render() {
    return (
      <div className="new-trip">
        <p className="page-title"><a onClick={::this.onBackClick}>&lt;</a> New Trip</p>
        <Form horizontal>
          <FormGroup controlId="formHorizontalEmail">
            <p>Trip name</p>
            <FormControl
              type="text"
              value={this.state.tripName}
              name='tripName'
              onChange={::this.onFieldChange} />
            </FormGroup>
          <FormGroup>
            <Button bsStyle="success" onClick={::this.handleSave} disabled={this.state.isLoading}>
              {this.state.isLoading ? 'Saving...' : 'Save'}
            </Button>
          </FormGroup>
        </Form>
      </div>
    );
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
