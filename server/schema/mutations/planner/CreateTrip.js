const {GraphQLNonNull, GraphQLString} = require('graphql');
const {mutationWithClientMutationId, offsetToCursor} = require('graphql-relay');

const db = require('../../database');

const CreateTripMutation = mutationWithClientMutationId({
  name: 'CreateTrip',
  inputFields: {
    userId: {type: new GraphQLNonNull(GraphQLString)},
    agentId: {type: new GraphQLNonNull(GraphQLString)},
    tripName: {type: new GraphQLNonNull(GraphQLString)},
    status: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: () => ({
    tripEdge: {
      type: require('../../connections').TripEdge,
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
      type: require('../../types/User'),
      resolve: (doc) => db.getUser(doc.userId),
    },
  }),
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
