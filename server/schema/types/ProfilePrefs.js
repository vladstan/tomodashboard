const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
} = require('graphql-relay');

const {nodeInterface} = require('../node-definitions');

const ProfilePrefs = new GraphQLObjectType({
  name: 'ProfilePrefs',
  fields: {
    id: globalIdField('ProfilePrefs'),
    home_airport: {
      type: GraphQLString,
      resolve: (doc) => doc.home_airport,
    },
    accommodation: {
      type: GraphQLString,
      resolve: (doc) => doc.accommodation,
    },
    accommodation_budget: {
      type: GraphQLString,
      resolve: (doc) => doc.accommodation_budget,
    },
    accommodation_budget_currency: {
      type: GraphQLString,
      resolve: (doc) => doc.accommodation_budget_currency,
    },
    flight_cabin: {
      type: GraphQLString,
      resolve: (doc) => doc.flight_cabin,
    },
    flight_seat: {
      type: GraphQLString,
      resolve: (doc) => doc.flight_seat,
    },
    next_trip_type: {
      type: GraphQLString,
      resolve: (doc) => doc.next_trip_type,
    },
    next_trip_destination: {
      type: GraphQLString,
      resolve: (doc) => doc.next_trip_destination,
    },
    next_trip_time: {
      type: GraphQLString,
      resolve: (doc) => doc.next_trip_time,
    },
    next_trip_purpose: {
      type: GraphQLString,
      resolve: (doc) => doc.next_trip_purpose,
    },
    next_trip_extra: {
      type: GraphQLString,
      resolve: (doc) => doc.next_trip_extra,
    },
  },
  interfaces: [nodeInterface],
});

module.exports = ProfilePrefs;
