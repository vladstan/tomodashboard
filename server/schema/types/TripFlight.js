const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
} = require('graphql-relay');

const TripFlight = new GraphQLObjectType({
  name: 'TripFlight',
  fields: () => ({
    id: globalIdField('TripFlight', (doc) => doc._id),
    pictureUrl: {
      type: GraphQLString,
    },
    airline: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLString,
    },
  }),
  interfaces: [require('../node-definitions').nodeInterface],
});

module.exports = TripFlight;
