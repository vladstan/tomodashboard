const {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const promisify = require('es6-promisify');
const jwt = require('jsonwebtoken');

const AgentModel = require('../../models/Agent');

const {nodeField} = require('../node-definitions');

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    agent: {
      type: require('../types/Agent'),
      args: {
        token: {type: GraphQLString},
      },
      async resolve(id, args) {
        const JWT_SECRET = process.env.JWT_SECRET;
        const verifyAsync = promisify(jwt.verify, jwt);
        const payload = await verifyAsync(args.token, JWT_SECRET);
        return await AgentModel.findOne({_id: payload.agentId});
      },
    },
    // summary: {
    //   type: Summary,
    //   args: {
    //     _id: {type: GraphQLString},
    //   },
    //   resolve: (id, args) => db.getSummary(args._id),
    // },
  }),
});

module.exports = Query;
