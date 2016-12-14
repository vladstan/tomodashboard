const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
} = require('graphql-relay');

const {nodeInterface} = require('../node-definitions');

const StripeCredentials = new GraphQLObjectType({
  name: 'StripeCredentials',
  fields: () => ({
    id: globalIdField('StripeCredentials'),
    customerId: {
      type: GraphQLString,
      resolve: (doc) => doc.customerId,
    },
  }),
  interfaces: [nodeInterface],
});

module.exports = StripeCredentials;
