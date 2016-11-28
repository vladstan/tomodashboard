import {
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import Agent from '../types/Agent';

import * as db from '../../database';
import * as bot from '../../tomobot';

const UpdateAgentTypingStatusMutation = mutationWithClientMutationId({
  name: 'UpdateAgentTypingStatus',
  inputFields: {
    userFacebookId: { type: new GraphQLNonNull(GraphQLString) },
    agentId: { type: new GraphQLNonNull(GraphQLString) },
    isTyping: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: {
    agent: {
      type: Agent,
      resolve: (payload) => db.getAgent(payload.agentId),
    },
  },
  mutateAndGetPayload: async (props) => {
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

export default UpdateAgentTypingStatusMutation;
