import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  offsetToCursor,
  mutationWithClientMutationId,
} from 'graphql-relay';

import Trip from '../types/Trip';
import User from '../types/User';

import * as db from '../../database';

const CreateTripMutation = mutationWithClientMutationId({
  name: 'CreateTrip',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    agentId: { type: new GraphQLNonNull(GraphQLString) },
    tripName: { type: new GraphQLNonNull(GraphQLString) },
    status: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    tripEdge: {
      type: Trip.edgeType,
      resolve: async (doc) => {
        const trips = await db.getTripsForUser(doc.userId);
        console.log('trips vs doc', '\n\n\n', trips, '\n\n\n', doc);
        const offset = trips.length - 1;
        const cursor = offsetToCursor(offset);

        // TODO use cursorForObjectInConnection
        return {
          cursor: cursor,
          node: doc,
        };
      },
    },
    user: {
      type: User,
      resolve: (doc) => db.getUser(doc.userId),
    },
  },
  mutateAndGetPayload: async (props) => {
    try {
      // console.log('create trip mutateAndGetPayload');
      return await db.createTrip({
        status: props.status,
        agentId: props.agentId,
        userId: props.userId,
        name: props.tripName,
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }
});

export default CreateTripMutation;
