const {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} = require('graphql');

const {
  mutationWithClientMutationId,
} = require('graphql-relay');

const User = require('../types/User');

const db = require('../database');
const bot = require('../tomobot');

const Stripe = require('stripe');

const stripeService = new Stripe(process.env.STRIPE_SECRET_KEY);

const UpdateStripeDetailsMutation = mutationWithClientMutationId({
  name: 'UpdateStripeDetails',
  inputFields: {
    userId: {type: new GraphQLNonNull(GraphQLString)},
    userFbId: {type: new GraphQLNonNull(GraphQLString)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    token: {type: new GraphQLNonNull(GraphQLString)},
    amount: {type: new GraphQLNonNull(GraphQLInt)},
    agentCreditAmount: {type: new GraphQLNonNull(GraphQLInt)},
    summaryId: {type: new GraphQLNonNull(GraphQLString)},
    agentId: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: () => ({
    user: {
      type: User,
      resolve: (payload) => db.getUser(payload.userId),
    },
  },
  async mutateAndGetPayload(props) {
    try {
      const user = await db.getUser(props.userId);
      let customerId = user.stripe && user.stripe.customerId || null;
      // console.log(props.token);

      if (!user.stripe || !user.stripe.customerId) {
        const token = JSON.parse(props.token);
        const customer = await stripeService.customers.create({
          source: token.id,
          description: props.name,
          email: token.email,
          metadata: {
            userId: props.userId,
          },
        });

        console.log('we have the customer!', customer);
        customerId = customer.id;

        const stripe = {
          customerId: customer.id,
        };

        // also add to our user in mongodb: token.email
        const upd = await db.updateStripeDetails(props.userId, stripe);
        console.log('we trapped the customer in our db =', upd);
      }

      console.log('charging mr customer...');
      const charge = await stripeService.charges.create({
        amount: props.amount * 100,
        currency: 'usd',
        customer: customerId,
      });

      console.log('charge=', charge);
      const chargeDoc = await db.createCharge({
        stripeCharge: Object.assign({}, charge),
        userId: props.userId,
        summaryId: props.summaryId,
      });

      await db.createAgentCredit({
        agentId: props.agentId,
        summaryId: props.summaryId,
        chargeId: chargeDoc._id,
        createdAt: new Date(),
        paid: false,
        amount: props.agentCreditAmount,
      });

      const session = await db.getSessionOfUser(props.userId);
      await bot.sendMessage({
        type: 'text',
        text: `Tomo has just charged ${props.name}'s CC for $${props.amount}`,
        senderId: 'tomo0',
        receiverId: props.userId,
        receiverFacebookId: props.userFbId,
        senderType: 'bot',
        receiverType: 'user',
        sessionId: session._id,
        timestamp: Date.now(),
      });
    } catch (ex) {
      console.error(ex);
    }

    return {
      userId: props.userId,
    };
  },
});

module.exports = UpdateStripeDetailsMutation;
