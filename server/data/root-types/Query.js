const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const User = require('../types/User');
const Agent = require('../types/Agent');
const Summary = require('../types/Summary');

const db = require('../database');
const {nodeField} = require('../node-definitions');

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
        token: {type: GraphQLString},
      },
      async resolve(id, args) {
        try {
          // const payload = jsonwebtoken.verify(args.token, jwtSecret);
          // return await db.getAgent(payload._id);
          return await db.getAgent(args.token);
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
    },
  }),
});

module.exports = Query;
