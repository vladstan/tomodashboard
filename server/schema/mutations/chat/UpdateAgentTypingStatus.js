const {
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
} = require('graphql');

const {
  mutationWithClientMutationId,
} = require('graphql-relay');

const Agent = require('../../types/Agent');
const AgentModel = require('../../../models/Agent');

const bot = require('../../../tomobot');

const UpdateAgentTypingStatusMutation = mutationWithClientMutationId({
  name: 'UpdateAgentTypingStatus',
  inputFields: {
    userFacebookId: {type: new GraphQLNonNull(GraphQLString)},
    agentId: {type: new GraphQLNonNull(GraphQLString)},
    isTyping: {type: new GraphQLNonNull(GraphQLBoolean)},
  },
  outputFields: {
    agent: {
      type: Agent,
      resolve: (payload) => AgentModel.findOne({_id: payload.agentId}),
    },
  },
  async mutateAndGetPayload(props) {
    await bot.sendTypingStatus(props.userFacebookId, props.isTyping);

    return {
      agentId: props.agentId,
    };
  },
});

module.exports = UpdateAgentTypingStatusMutation;
