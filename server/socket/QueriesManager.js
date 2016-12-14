const {graphql} = require('graphql');

const schema = require('../data/schema');

class QueriesManager {

  constructor(socket) {
    this.socket = socket;

    // set listeners
    socket.on('query', this.onQuery.bind(this));
  }

  onQuery({query, variables}, callback) {
    graphql(schema, query, null, null, variables)
      .catch((err) => this.socket.emit('error', err)) // emit error when there is one
      .then((result) => callback(result)); // always call the callback
  }

}

module.exports = QueriesManager;
