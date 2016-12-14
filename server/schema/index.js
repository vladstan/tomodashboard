const {GraphQLSchema} = require('graphql');

const Query = require('./roots/Query');
const Mutation = require('./roots/Mutation');
const Subscription = require('./roots/Subscription');

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
});

module.exports = schema;
