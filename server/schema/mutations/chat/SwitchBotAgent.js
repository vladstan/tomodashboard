const {
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
} = require('graphql');

const {
  mutationWithClientMutationId,
} = require('graphql-relay');

const User = require('../types/User');

const db = require('../database');
const bot = require('../tomobot');

const SwitchBotAgentMutation = mutationWithClientMutationId({
  name: 'SwitchBotAgent',
  inputFields: {
    userId: {type: new GraphQLNonNull(GraphQLString)},
    botMuted: {type: new GraphQLNonNull(GraphQLBoolean)},
    agentName: {type: new GraphQLNonNull(GraphQLString)},
    userFbId: {type: new GraphQLNonNull(GraphQLString)},
    agentImageUrl: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: {
    user: {
      type: User,
      resolve: (payload) => db.getUser(payload.userId),
    },
  },
  async mutateAndGetPayload(props) {
    try {
      await db.switchBotAgent(props.userId, props.botMuted);
      const session = await db.getSessionOfUser(props.userId);
      let textMessage;

      if (props.botMuted) {
        textMessage = "You're now talking to " + props.agentName;
      } else {
        textMessage = "You're now talking to Tomo";
      }

      await bot.sendMessage({
        type: 'text',
        text: textMessage,
        senderId: 'tomo0',
        receiverId: props.userId,
        receiverFacebookId: props.userFbId,
        senderType: 'bot',
        receiverType: 'user',
        sessionId: session._id,
        timestamp: Date.now(),
      });

      if (props.botMuted) {
        await bot.sendMessage({
          type: 'image',
          imageUrl: props.agentImageUrl,
          senderId: 'tomo0',
          receiverId: props.userId,
          receiverFacebookId: props.userFbId,
          senderType: 'bot',
          receiverType: 'user',
          sessionId: session._id,
          timestamp: Date.now(),
        });
      } else {
        await bot.sendMessage({
          type: 'image',
          imageUrl: 'https://s3-us-west-1.amazonaws.com/img.hellotomo.com/HiTomo.jpeg',
          senderId: 'tomo0',
          receiverId: props.userId,
          receiverFacebookId: props.userFbId,
          senderType: 'bot',
          receiverType: 'user',
          sessionId: session._id,
          timestamp: Date.now(),
        });
      }
    } catch (ex) {
      console.error('switch agent mutateAndGetPayload error:', ex);
    }

    return {
      userId: props.userId
    };
  },
});

module.exports = SwitchBotAgentMutation;
