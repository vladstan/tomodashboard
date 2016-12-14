const {
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
} = require('graphql');

const {
  mutationWithClientMutationId,
} = require('graphql-relay');

const Agent = require('../types/Agent');

const db = require('../database');
const bot = require('../tomobot');

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
      resolve: (payload) => db.getAgent(payload.agentId),
    },
  },
  async mutateAndGetPayload(props) {
    try {
      // await updateAgent(props.agentId, {
      //   lastReadWatermark: props.lastReadWatermark,
      // });
      await bot.sendTypingStatus(props.userFacebookId, props.isTyping);
    } catch (ex) {
      console.error('error inside mutation UpdateAgentTypingStatusMutation:', ex);
    }

    return {
      agentId: props.agentId
    };
  },
});

module.exports = UpdateAgentTypingStatusMutation;
