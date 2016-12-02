import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  offsetToCursor,
} from 'graphql-relay';

import IncomingReq from '../types/IncomingReq';

import * as db from '../../database';
import { subscriptionWithClientId } from 'graphql-relay-subscription';

const AddIncomingReqSubscription = subscriptionWithClientId({
  name: 'AddIncomingReqSubscription',
  inputFields: {
    agentId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    incomingReq: {
      type: IncomingReq,
      resolve: (doc) => doc,
    },
    incomingReqEdge: {
      type: IncomingReq.edgeType,
      resolve: async (doc) => {
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

export default AddIncomingReqSubscription;
