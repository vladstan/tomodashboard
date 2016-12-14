const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const {
  mutationWithClientMutationId,
} = require('graphql-relay');

const Agent = require('../types/Agent');

const db = require('../database');
const bot = require('../tomobot');

const UpdateAgentWatermarksMutation = mutationWithClientMutationId({
  name: 'UpdateAgentWatermarks',
  inputFields: {
    userFacebookId: {type: new GraphQLNonNull(GraphQLString)},
    agentId: {type: new GraphQLNonNull(GraphQLString)},
    lastReadWatermark: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: {
    agent: {
      type: Agent,
      resolve: (payload) => db.getAgent(payload.agentId),
    },
  },
  async mutateAndGetPayload(props) {
    try {
      await db.updateAgent(props.agentId, {
        lastReadWatermark: props.lastReadWatermark,
      });
      await bot.markConvAsRead(props.userFacebookId);
    } catch (ex) {
      console.error(ex);
    }

    return {
      agentId: props.agentId
    };
  },
});

module.exports = UpdateAgentWatermarksMutation;
