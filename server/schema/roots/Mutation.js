const {GraphQLObjectType} = require('graphql');

// const SendMessageMutation = require('../mutations/chat/SendMessage');
// const SwitchBotAgentMutation = require('../mutations/chat/SwitchBotAgent');
// const UpdateStripeDetailsMutation = require('../mutations/UpdateStripeDetails');
const UpdateUserWatermarksMutation = require('../mutations/chat/UpdateUserWatermarks');
const UpdateAgentTypingStatusMutation = require('../mutations/chat/UpdateAgentTypingStatus');

const LogInAgentMutation = require('../mutations/auth/LogInAgent');

// const GetSummaryLinkMutation = require('../mutations/planner/GetSummaryLink');
// const CreateTripMutation = require('../mutations/planner/CreateTrip');
// const UpdateTripMutation = require('../mutations/planner/UpdateTrip');

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // sendMessage: SendMessageMutation,
    // switchBotAgent: SwitchBotAgentMutation,
    // updateStripeDetails: UpdateStripeDetailsMutation,

    updateUserWatermarks: UpdateUserWatermarksMutation,
    updateAgentTypingStatus: UpdateAgentTypingStatusMutation,

    logInAgent: LogInAgentMutation,

    // getSummaryLink: GetSummaryLinkMutation,
    // createTrip: CreateTripMutation,
    // updateTrip: UpdateTripMutation,
  }),
});

module.exports = Mutation;
