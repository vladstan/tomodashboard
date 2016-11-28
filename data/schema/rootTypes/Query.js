import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import User from '../types/User';
import Agent from '../types/Agent';
import Summary from '../types/Summary';

import * as db from '../../database';
import {nodeField} from '../nodeDefinitions';

import jsonwebtoken from 'jsonwebtoken';

const jwtSecret = '23rfqwdf32wqda';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    user: {
      type: User,
      args: {
        _id: {
          type: GraphQLString,
        },
      },
      resolve: (id, args) => db.getUser(args._id),
    },
    agent: {
      type: Agent,
      args: {
        token: {
          type: GraphQLString,
        },
      },
      resolve: async (id, args) => {
        try {
          const payload = jsonwebtoken.verify(args.token, jwtSecret);
          return await db.getAgent(payload._id);
        } catch (ex) {
          console.error('getAgent', ex);
        }
      },
    },
    summary: {
      type: Summary,
      args: {
        _id: {
          type: GraphQLString,
        },
      },
      resolve: (id, args) => db.getSummary(args._id),
    }
  })
});

export default Query;
