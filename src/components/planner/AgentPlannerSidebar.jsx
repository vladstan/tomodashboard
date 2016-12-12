import React from 'react';

import Relay from 'react-relay';
import RelaySubscriptions from 'relay-subscriptions';

import NewTripSidebar from './NewTripSidebar';
import EditTripSidebar from './EditTripSidebar';
import TripsListSidebar from './TripsListSidebar';

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

  goToEditTrip(trip) {
    this.setState({
      ...this.state,
      pageIndex: 2,
      trip,
    });
  }

  goToTripsList() {
    this.setState({
      ...this.state,
      pageIndex: 0,
    });
  }

  render() {
    try {
      return (
        <div className="planner-container">
          {this.state.pageIndex === 0 &&
            <TripsListSidebar
              goToNewTrip={::this.goToNewTrip}
              goToEditTrip={::this.goToEditTrip}
              user={this.props.user}
              relay={this.props.relay} />}
          {this.state.pageIndex === 1 &&
            <NewTripSidebar
              goToTripsList={::this.goToTripsList}
              user={this.props.user}
              agent={this.props.agent}
              relay={this.props.relay} />}
          {this.state.pageIndex === 2 &&
            <EditTripSidebar
              goToTripsList={::this.goToTripsList}
              trip={this.state.trip}
              user={this.props.user}
              agent={this.props.agent}
              relay={this.props.relay} />}
        </div>
      );
    } catch (ex) {
      console.error('agentPlannerSidebarComp', ex);
    }
  }

}

const AgentPlannerSidebarContainer = RelaySubscriptions.createContainer(AgentPlannerSidebar, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        ${NewTripSidebar.getFragment('user')}
        ${EditTripSidebar.getFragment('user')}
        ${TripsListSidebar.getFragment('user')}
      }
    `,
    agent: () => Relay.QL`
      fragment on Agent {
        ${NewTripSidebar.getFragment('agent')}
        ${EditTripSidebar.getFragment('agent')}
      }
    `,
  },
  subscriptions: [
    // TODO subscribe to changes to user.trips?
  ],
});

export default AgentPlannerSidebarContainer;
