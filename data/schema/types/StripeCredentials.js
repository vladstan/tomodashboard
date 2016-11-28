import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  globalIdField,
} from 'graphql-relay';

import {nodeInterface} from '../nodeDefinitions';

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

export default StripeCredentials;
