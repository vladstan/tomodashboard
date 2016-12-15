const {ObjectID} = require('mongodb');

const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const {
  mutationWithClientMutationId,
} = require('graphql-relay');

const db = require('../../database');

const GetSummaryLinkMutation = mutationWithClientMutationId({
  name: 'GetSummaryLink',
  inputFields: {
    summary: {type: new GraphQLNonNull(GraphQLString)},
    agentId: {type: new GraphQLNonNull(GraphQLString)},
    userId: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: {
    link: {
      type: GraphQLString,
      resolve: (payload) => payload.link,
    },
  },
  async mutateAndGetPayload(props) {
    const summary = JSON.parse(props.summary);
    if (!Array.isArray(summary.fields)) {
      summary.fields = Object.keys(summary.fields).map((key) => summary.fields[key]);
    }

    summary.agentId = props.agentId;
    summary.userId = props.userId;

    const summaryDoc = await db.createSummary({
      fields: summary.fields.map((f) => ({
        _id: new ObjectID(),
        name: f.name,
        price: parseInt(f.price || '0', 10) || 0,
        segments: parseInt(f.segments || '0', 10) || 0,
        segmentPrice: f.segmentPrice,
      })).filter((f) => !!f.name),
      agentCutPercent: summary.agentCutPercent,
      agentId: summary.agentId,
      userId: summary.userId,
    });

    return {
      link: summaryDoc._id, // link is actually ID
    };
  },
});

module.exports = GetSummaryLinkMutation;
