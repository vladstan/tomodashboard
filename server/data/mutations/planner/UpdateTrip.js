const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const {
  mutationWithClientMutationId,
} = require('graphql-relay');

const Trip = require('../../types/Trip');

const db = require('../../database');

const UpdateTripMutation = mutationWithClientMutationId({
  name: 'UpdateTrip',
  inputFields: {
    tripId: {type: new GraphQLNonNull(GraphQLString)},
    name: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: {
    trip: {
      type: Trip,
      resolve: (payload) => db.getTrip(payload.tripId),
    },
  },
  async mutateAndGetPayload(props) {
    try {
      await db.updateTrip(props.tripId, {
        name: props.name,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }

    return {
      tripId: props.tripId,
    };
  }
});

module.exports = UpdateTripMutation;
