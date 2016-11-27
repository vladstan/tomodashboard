import Relay from 'react-relay';

class UpdateTripMutation extends Relay.Mutation {

  static fragments = {
    trip: () => Relay.QL`
      fragment on Trip {
        id
        _id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation { updateTrip }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateTripPayload {
        trip
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        trip: this.props.trip.id,
      },
    }];
  }

  getVariables() {
    return {
      tripId: this.props.trip._id,
      name: this.props.name,
    };
  }

}

export default UpdateTripMutation;
