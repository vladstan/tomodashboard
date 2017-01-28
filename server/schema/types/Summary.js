const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const {
  globalIdField,
  connectionFromArray,
  connectionArgs,
} = require('graphql-relay');

const UserModel = require('../../models/User');
const AgentModel = require('../../models/Agent');

const Summary = new GraphQLObjectType({
  name: 'Summary',
  fields: () => ({
    id: globalIdField('Summary', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    fields: () => ({
      type: require('../connections').SummaryFieldsConnection,
      args: connectionArgs,
      resolve: (doc, args) => connectionFromArray(doc.fields, args),
    }),
    total: {
      type: GraphQLInt,
      resolve: (doc) => {
        const totalPrice = doc.fields.reduce((acc, f) => acc + f.price, 0);
        const totalFee = doc.fields.reduce((acc, f) => acc + f.segments * f.segmentPrice, 0);
        return totalPrice + totalFee;
      },
    },
    price: {
      type: GraphQLInt,
      resolve: (doc) => {
        const totalPrice = doc.fields.reduce((acc, f) => acc + f.price, 0);
        return totalPrice;
      },
    },
    serviceFee: {
      type: GraphQLInt,
      resolve: (doc) => {
        const totalFee = doc.fields.reduce((acc, f) => acc + f.segments * f.segmentPrice, 0);
        return totalFee;
      },
    },
    agentFee: {
      type: GraphQLInt,
      resolve: (doc) => {
        const totalFee = doc.fields.reduce((acc, f) => acc + f.segments * f.segmentPrice, 0);
        return Math.ceil(totalFee * doc.agentCutPercent);
      },
    },
    user: {
      type: require('./User'),
      resolve: (doc) => UserModel.findOne({_id: doc.userId}),
    },
    agent: {
      type: require('./Agent'),
      resolve: (doc) => AgentModel.findOne({_id: doc.agentId}),
    },
  }),
  interfaces: [require('../node-definitions').nodeInterface],
});

module.exports = Summary;
