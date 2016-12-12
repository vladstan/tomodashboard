const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const {
  offsetToCursor,
} = require('graphql-relay');

const IncomingReq = require('../types/IncomingReq');

const db = require('../database');
const {subscriptionWithClientId} = require('graphql-relay-subscription');

const AddIncomingReqSubscription = subscriptionWithClientId({
  name: 'AddIncomingReqSubscription',
  inputFields: {
    agentId: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: {
    incomingReq: {
      type: IncomingReq,
      resolve: (doc) => doc,
    },
    incomingReqEdge: {
      type: IncomingReq.edgeType,
      async resolve(doc) {
        const ireqs = await db.getIncomingReqs();
        // const ireq = await getIncomingReq(req._id);

        // console.log('ireqs', ireqs);
        // console.log('ireq', ireq);
        //
        // const crs = cursorForObjectInConnection(ireqs, ireq);
        // console.log('ireqs.indexOf(ireq)', ireqs.indexOf(ireq));
        // console.log('crs', crs);

        const offset = ireqs.length - 1;
        const cursor = offsetToCursor(offset);
        console.log('cursor', cursor, offset);

        // TODO use cursorForObjectInConnection
        return {
          cursor: cursor,
          node: doc,
        };
      },
    },
  },
  subscribe: (input, context) => {
    context.subscribe('add_incoming_req'); // use agentId
  },
});

module.exports = AddIncomingReqSubscription;
