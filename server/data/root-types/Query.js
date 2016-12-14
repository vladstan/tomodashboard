const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const jwt = require('jsonwebtoken');

const {nodeField} = require('../node-definitions');

const Agent = require('../types/Agent');
const Summary = require('../types/Summary');

const db = require('../database');

const JWT_SECRET = process.env.JWT_SECRET;

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    agent: {
      type: Agent,
      args: {
        token: {type: GraphQLString},
      },
      async resolve(id, args) {
        const payload = await new Promise((resolve, reject) => {
          jwt.verify(args.token, JWT_SECRET, (err, payload) => {
            if (err) reject(err);
            else resolve(payload);
          });
        });
        return await db.getAgent(payload.agentId);
      },
    },
    summary: {
      type: Summary,
      args: {
        _id: {type: GraphQLString},
      },
      resolve: (id, args) => db.getSummary(args._id),
    },
  }),
});

module.exports = Query;
