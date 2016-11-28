import {GraphQLSchema} from 'graphql';

import Query from './schema/rootTypes/Query';
import Mutation from './schema/rootTypes/Mutation';
import Subscription from './schema/rootTypes/Subscription';

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
});
