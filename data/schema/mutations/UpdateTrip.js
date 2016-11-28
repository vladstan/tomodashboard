import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import Trip from '../types/Trip';

import * as db from '../../database';

const UpdateTripMutation = mutationWithClientMutationId({
  name: 'UpdateTrip',
  inputFields: {
    tripId: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    trip: {
      type: Trip,
      resolve: (payload) => db.getTrip(payload.tripId),
    },
  },
  mutateAndGetPayload: async (props) => {
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

export default UpdateTripMutation;
