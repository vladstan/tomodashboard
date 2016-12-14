const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const {
  offsetToCursor,
} = require('graphql-relay');

const {subscriptionWithClientId} = require('graphql-relay-subscription');

const NewIncomingRequestSubscription = subscriptionWithClientId({
  name: 'NewIncomingRequestSubscription',
  inputFields: {
    agentId: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: () => ({
    incomingRequest: {
      type: require('../types/IncomingRequest'),
      resolve: (doc) => doc,
    },
    incomingRequestEdge: {
      type: require('../types/IncomingRequest').edgeType,
      async resolve(doc) {
        // const ireqs = await db.getIncomingReqs();
        // const ireq = await getIncomingReq(req._id);

        // console.log('ireqs', ireqs);
        // console.log('ireq', ireq);
        //
        // const crs = cursorForObjectInConnection(ireqs, ireq);
        // console.log('ireqs.indexOf(ireq)', ireqs.indexOf(ireq));
        // console.log('crs', crs);

        // const offset = ireqs.length - 1;
        const offset = 0;
        const cursor = offsetToCursor(offset);
        console.log('cursor', cursor, offset);

        // TODO use cursorForObjectInConnection
        return {
          cursor: cursor,
          node: doc,
        };
      },
    },
  }),
  subscribe: (input, context) => {
    context.subscribe('new:incoming_request:' + input.agentId);
  },
});

module.exports = NewIncomingRequestSubscription;
