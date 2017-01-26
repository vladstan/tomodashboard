const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const {
  mutationWithClientMutationId,
} = require('graphql-relay');

const UserModel = require('../../../models/User');

const bot = require('../../../tomobot');

const UpdateUserWatermarksMutation = mutationWithClientMutationId({
  name: 'UpdateUserWatermarks',
  inputFields: {
    userFacebookId: {type: new GraphQLNonNull(GraphQLString)},
    userId: {type: new GraphQLNonNull(GraphQLString)},
    lastReadWatermark: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: {
    agent: {
      type: require('../../types/User'),
      resolve: (payload) => UserModel.findOne({_id: payload.userId}),
    },
  },
  async mutateAndGetPayload(props) {
    await Promise.all([
      UserModel.update({_id: props.userId}, {lastReadWatermark: props.lastReadWatermark}),
      bot.markConvAsRead(props.userFacebookId),
    ]);

    return {
      userId: props.userId,
    };
  },
});

module.exports = UpdateUserWatermarksMutation;
