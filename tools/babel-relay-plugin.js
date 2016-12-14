const babelRelayPlugin = require('babel-relay-plugin');
const schema = require('../.graphql/schema.json');

module.exports = babelRelayPlugin(schema.data);
