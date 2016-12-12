const {
  GraphQLObjectType,
} = require('graphql');

const SendMessageMutation = require('../mutations/SendMessage');
const SwitchBotAgentMutation = require('../mutations/SwitchBotAgent');
const UpdateStripeDetailsMutation = require('../mutations/UpdateStripeDetails');
const UpdateAgentWatermarksMutation = require('../mutations/UpdateAgentWatermarks');
const UpdateAgentTypingStatusMutation = require('../mutations/UpdateAgentTypingStatus');

const GetSummaryLinkMutation = require('../mutations/planner/GetSummaryLink');
const CreateTripMutation = require('../mutations/planner/CreateTrip');
const UpdateTripMutation = require('../mutations/planner/UpdateTrip');

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

module.exports = Mutation;
