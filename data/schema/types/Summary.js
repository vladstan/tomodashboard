import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

import {
  globalIdField,
  connectionFromArray,
  connectionArgs,
} from 'graphql-relay';

import * as db from '../../database';

import User from './User';
import Agent from './Agent';
import SummaryField from './SummaryField';

import {nodeInterface} from '../nodeDefinitions';

const Summary = new GraphQLObjectType({
  name: 'Summary',
  fields: () => ({
    id: globalIdField('Summary', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    fields: {
      type: SummaryField.connectionType,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromArray(doc.fields, args),
    },
    total: {
      type: GraphQLInt,
      resolve: (doc) => {
        const totalPrice = doc.fields.reduce((acc, f) => acc + f.price, 0);
        const totalFee = doc.fields.reduce((acc, f) => acc + f.segments * f.segmentPrice, 0);
        return totalPrice + totalFee;
      },
    },
    price: {
      type: GraphQLInt,
      resolve: (doc) => {
        const totalPrice = doc.fields.reduce((acc, f) => acc + f.price, 0);
        return totalPrice;
      },
    },
    serviceFee: {
      type: GraphQLInt,
      resolve: (doc) => {
        const totalFee = doc.fields.reduce((acc, f) => acc + f.segments * f.segmentPrice, 0);
        return totalFee;
      },
    },
    agentFee: {
      type: GraphQLInt,
      resolve: (doc) => {
        const totalFee = doc.fields.reduce((acc, f) => acc + f.segments * f.segmentPrice, 0);
        return Math.ceil(totalFee * doc.agentCutPercent);
      },
    },
    user: {
      type: User,
      resolve: (doc) => db.getUser(doc.userId),
    },
    agent: {
      type: Agent,
      resolve: (doc) => db.getAgent(doc.agentId),
    },
  }),
  interfaces: [nodeInterface],
});

export default Summary;
