const {graphql} = require('graphql');

const schema = require('../data/schema');

class QueriesManager {

  constructor(socket) {
    this.socket = socket;

    // set listeners
    socket.on('query', this.onQuery.bind(this));
    socket.on('queries', this.onQueries.bind(this));
  }

  onQuery({id, query, variables}) {
    graphql(schema, query, null, null, variables)
      .then((resp) => this.socket.emit('query_response:' + id, {data: resp}))
      .catch((err) => this.socket.emit('error', err));
  }

  onQueries(queries) {
    for (const query of queries) {
      this.onQuery(query);
    }
  }

}

module.exports = QueriesManager;
