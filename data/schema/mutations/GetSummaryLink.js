import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import * as db from '../../database';

const GetSummaryLinkMutation = mutationWithClientMutationId({
  name: 'GetSummaryLink',
  inputFields: {
    summary: { type: new GraphQLNonNull(GraphQLString) },
    agentId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    link: {
      type: GraphQLString,
      resolve: (payload) => payload.link,
    },
  },
  mutateAndGetPayload: async (props) => {
    try {
      const summary = JSON.parse(props.summary);
      if (!Array.isArray(summary.fields)) {
        summary.fields = Object.keys(summary.fields)
          .map(key => summary.fields[key]);
      }
      // console.log('parsed summary=', summary, 'FROM', props.summary);
      summary.agentId = props.agentId;
      summary.userId = props.userId;
      const summaryDoc = await db.insertAndGetSummary(summary);
      return {
        link: summaryDoc._id, // link is actually ID
      };
    } catch (ex) {
      console.error(ex);
    }

    return {};
  },
});

export default GetSummaryLinkMutation;
