const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const {
  mutationWithClientMutationId,
} = require('graphql-relay');

const jwt = require('jsonwebtoken');

const db = require('../../database');

const JWT_SECRET = process.env.JWT_SECRET;

const LogInAgentMutation = mutationWithClientMutationId({
  name: 'LogInAgent',
  inputFields: {
    uid: {type: new GraphQLNonNull(GraphQLString)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    pictureUrl: {type: new GraphQLNonNull(GraphQLString)},
    accessToken: {type: new GraphQLNonNull(GraphQLString)},
    expiresIn: {type: new GraphQLNonNull(GraphQLInt)},
  },
  outputFields: {
    accessToken: {type: GraphQLString},
  },
  async mutateAndGetPayload(props) {
    const agent = await db.logInAgent({
      uid: props.uid,
      name: props.name,
      email: props.email,
      pictureUrl: props.pictureUrl,
    });

    const payload = {
      agentId: agent._id,
      facebookAccessToken: props.accessToken,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: props.expiresIn,
    });

    return {
      accessToken: token,
    };
  },
});

module.exports = LogInAgentMutation;
