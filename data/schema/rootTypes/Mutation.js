import {
  GraphQLObjectType,
} from 'graphql';

import SendMessageMutation from '../mutations/SendMessage';
import SwitchBotAgentMutation from '../mutations/SwitchBotAgent';
import UpdateStripeDetailsMutation from '../mutations/UpdateStripeDetails';
import UpdateAgentWatermarksMutation from '../mutations/UpdateAgentWatermarks';
import UpdateAgentTypingStatusMutation from '../mutations/UpdateAgentTypingStatus';
import GetSummaryLinkMutation from '../mutations/GetSummaryLink';
import CreateTripMutation from '../mutations/CreateTrip';
import UpdateTripMutation from '../mutations/UpdateTrip';

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    sendMessage: SendMessageMutation,
    switchBotAgent: SwitchBotAgentMutation,
    updateStripeDetails: UpdateStripeDetailsMutation,
    updateAgentWatermarks: UpdateAgentWatermarksMutation,
    updateAgentTypingStatus: UpdateAgentTypingStatusMutation,
    getSummaryLink: GetSummaryLinkMutation,
    createTrip: CreateTripMutation,
    updateTrip: UpdateTripMutation,
  }),
});

export default Mutation;
