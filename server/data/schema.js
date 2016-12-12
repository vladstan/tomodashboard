const {GraphQLSchema} = require('graphql');

const Query = require('./root-types/Query');
const Mutation = require('./root-types/Mutation');
const Subscription = require('./root-types/Subscription');

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
});

module.exports = schema;
