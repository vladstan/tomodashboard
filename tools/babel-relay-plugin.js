const babelRelayPlugin = require('babel-relay-plugin');
const schema = require('../server/schema.json');

module.exports = babelRelayPlugin(schema.data);
