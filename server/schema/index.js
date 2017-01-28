const {GraphQLSchema} = require('graphql');
const {maskErrors} = require('graphql-errors');

const Query = require('./roots/Query');
const Mutation = require('./roots/Mutation');
const Subscription = require('./roots/Subscription');

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
});

const formatError = function(err) {
  console.error(err);
  return err;
};

maskErrors(schema, formatError);
module.exports = schema;
