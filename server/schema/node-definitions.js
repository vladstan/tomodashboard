const {nodeDefinitions} = require('graphql-relay');

function idFetcher(globalId) {
  // TODO implement this correctly once I understand how it works
  console.error('ERRRRRR nodeDefinitions globalId', globalId);
  throw new Error('ERRRRRR nodeDefinitions globalId');
  // let {type, _id} = fromGlobalId(globalId);
  // if (type === 'User') {
  //   return getWithType(getUser(_id), 'User');
  // } else if (type === 'Agent') {
  //   return getWithType(getAgent(_id), 'Agent');
  // } else if (type === 'Trip') {
  //   return getWithType(getTrip(_id), 'Trip');
  // } else if (type === 'Summary') {
  //   return getWithType(getSummary(_id), 'Summary');
  // } else if (type === 'Profile') {
  //   return getWithType(getProfile(_id), 'Profile');
  // } else if (type === 'IncomingReq') {
  //   return getWithType(getIncomingReq(_id), 'IncomingReq');
  // } else if (type === 'Message') {
  //   return getWithType(getMessage(_id), 'Message');
  // } else {
  //   return null;
  // }
}

function typeResolver(obj) {
  // TODO implement this correctly once I understand how it works
  console.error('ERRRRRR nodeDefinitions obj', obj);
  throw new Error('ERRRRRR nodeDefinitions obj');
  // if (isType(obj, 'User')) {
  //   return User;
  // } else if (isType(obj, 'Agent')) {
  //   return Agent;
  // } else if (isType(obj, 'Summary')) {
  //   return Summary;
  // } else if (isType(obj, 'Trip')) {
  //   return Trip;
  // } else if (isType(obj, 'Profile')) {
  //   return Profile;
  // } else if (isType(obj, 'IncomingReq')) {
  //   return IncomingReq;
  // } else if (isType(obj, 'Message')) {
  //   return Message;
  // } else {
  //   return null;
  // }
}

const defs = nodeDefinitions(idFetcher, typeResolver);
const {nodeInterface, nodeField} = defs;

module.exports = {
  nodeInterface,
  nodeField,
};
