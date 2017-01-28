const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
} = require('graphql-relay');

const TripAccommodation = new GraphQLObjectType({
  name: 'TripAccommodation',
  fields: () => ({
    id: globalIdField('TripAccommodation', (doc) => doc._id),
    link: {
      type: GraphQLString,
    },
    pictureUrl: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLString,
    },
  }),
  interfaces: [require('../node-definitions').nodeInterface],
});

module.exports = TripAccommodation;
