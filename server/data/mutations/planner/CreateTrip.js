const {GraphQLNonNull, GraphQLString} = require('graphql');
const {mutationWithClientMutationId, offsetToCursor} = require('graphql-relay');

const Trip = require('../../types/Trip');
const User = require('../../types/User');

const db = require('../../database');

const CreateTripMutation = mutationWithClientMutationId({
  name: 'CreateTrip',
  inputFields: {
    userId: {type: new GraphQLNonNull(GraphQLString)},
    agentId: {type: new GraphQLNonNull(GraphQLString)},
    tripName: {type: new GraphQLNonNull(GraphQLString)},
    status: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: {
    tripEdge: {
      type: Trip.edgeType,
      async resolve(doc) {
        const trips = await db.getTripsForUser(doc.userId);

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
  async mutateAndGetPayload(props) {
    const trip = await db.createTrip({
      status: props.status,
      agentId: props.agentId,
      userId: props.userId,
      name: props.tripName,
    });

    return trip;
  },
});

module.exports = CreateTripMutation;
