const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
  connectionArgs,
  connectionFromArray,
} = require('graphql-relay');

const Trip = new GraphQLObjectType({
  name: 'Trip',
  fields: () => ({
    id: globalIdField('Trip', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    status: {
      type: GraphQLString,
      resolve: (doc) => doc.status,
    },
    userId: {
      type: GraphQLString,
      resolve: (doc) => doc.userId,
    },
    agentId: {
      type: GraphQLString,
      resolve: (doc) => doc.agentId,
    },
    name: {
      type: GraphQLString,
      resolve: (doc) => doc.name,
    },
    flights: {
      type: require('../connections').TripFlightsConnection,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromArray(doc.flights || [], args),
    },
    accommodation: {
      type: require('../connections').TripAccommodationConnection,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromArray(doc.accommodation || [], args),
    },
    activities: {
      type: require('../connections').TripActivitiesConnection,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromArray(doc.activities || [], args),
    },
    // createdAt: {
    //   type: GraphQLString,
    //   resolve: (doc) => doc.type,
    // },
  }),
  interfaces: [require('../node-definitions').nodeInterface],
});

module.exports = Trip;
