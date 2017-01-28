const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
} = require('graphql-relay');

const TripActivity = new GraphQLObjectType({
  name: 'TripActivity',
  fields: () => ({
    id: globalIdField('TripActivity', (doc) => doc._id),
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

module.exports = TripActivity;
