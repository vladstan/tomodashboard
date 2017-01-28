const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const {
  globalIdField,
} = require('graphql-relay');

const StripeCredentials = new GraphQLObjectType({
  name: 'StripeCredentials',
  fields: () => ({
    id: globalIdField('StripeCredentials'),
    customerId: {
      type: GraphQLString,
      resolve: (doc) => doc.customerId,
    },
  }),
  interfaces: [require('../node-definitions').nodeInterface],
});

module.exports = StripeCredentials;
