import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import Agent from '../types/Agent';

import * as db from '../../database';
import * as bot from '../../tomobot';

const UpdateAgentWatermarksMutation = mutationWithClientMutationId({
  name: 'UpdateAgentWatermarks',
  inputFields: {
    userFacebookId: { type: new GraphQLNonNull(GraphQLString) },
    agentId: { type: new GraphQLNonNull(GraphQLString) },
    lastReadWatermark: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    agent: {
      type: Agent,
      resolve: (payload) => db.getAgent(payload.agentId),
    },
  },
  mutateAndGetPayload: async (props) => {
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

export default UpdateAgentWatermarksMutation;
