const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const {
  mutationWithClientMutationId,
} = require('graphql-relay');

const Agent = require('../types/Agent');
const AgentModel = require('../../models/Agent');

const bot = require('../../tomobot');

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
      resolve: (payload) => AgentModel.findOne({_id: payload.agentId}),
    },
  },
  async mutateAndGetPayload(props) {
    await Promise.all([
      AgentModel.update({_id: props.agentId}, {lastReadWatermark: props.lastReadWatermark}),
      bot.markConvAsRead(props.userFacebookId),
    ]);

    return {
      agentId: props.agentId,
    };
  },
});

module.exports = UpdateAgentWatermarksMutation;
