import debug from 'debug';

import React from 'react';
import Relay from 'react-relay';
import {routerShape} from 'react-router';

import NewTripSidebar from './NewTripSidebar';
import EditTripSidebar from './EditTripSidebar';
import TripsListSidebar from './TripsListSidebar';

const log = debug('tomo:planner:AgentPlannerSidebar');

class AgentPlannerSidebar extends React.Component {

  static contextTypes = {
    router: routerShape.isRequired,
  }

  static propTypes = {
    plannerTripId: React.PropTypes.string, // relay variable
    user: React.PropTypes.object.isRequired,
    agent: React.PropTypes.object.isRequired,
  }

  goToPage(paneName, extraArgs = {}) {
    const {router: {location}} = this.context;
    const nextState = {
      pathname: location.pathname,
      query: {
        plannerPage: paneName,
        ...extraArgs,
      },
    };
    log('pushing new router:', nextState);
    this.context.router.replace(nextState);
  }

  render() {
    const {router} = this.context;
    const {plannerPage} = router.location.query;

    const pages = {
      viewTrips: (
        <TripsListSidebar
          goToPage={::this.goToPage}
          user={this.props.user} />
      ),
      newTrip: (
        <NewTripSidebar
          goToPage={::this.goToPage}
          user={this.props.user}
          agent={this.props.agent} />
      ),
      editTrip: (
        <EditTripSidebar
          goToPage={::this.goToPage}
          tripId={this.props.plannerTripId}
          user={this.props.user}
          agent={this.props.agent} />
      ),
    };

    return (
      <div className="planner-container">
        {pages[plannerPage] || pages.viewTrips}
      </div>
    );
  }

}

const AgentPlannerSidebarContainer = Relay.createContainer(AgentPlannerSidebar, {
  initialVariables: {
    plannerTripId: null,
  },
  fragments: {
    user: ({plannerTripId}) => Relay.QL`
      fragment on User {
        ${TripsListSidebar.getFragment('user')}
        ${NewTripSidebar.getFragment('user')}
        ${EditTripSidebar.getFragment('user', {tripId: plannerTripId})}
      }
    `,
    agent: ({plannerTripId}) => Relay.QL`
      fragment on Agent {
        ${NewTripSidebar.getFragment('agent')}
        ${EditTripSidebar.getFragment('agent', {tripId: plannerTripId})}
      }
    `,
  },
});

export default AgentPlannerSidebarContainer;
