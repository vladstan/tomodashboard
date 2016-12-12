import io from 'socket.io-client';

import BaseNetworkLayer from './BaseNetworkLayer';

class SocketIoNetworkLayer extends BaseNetworkLayer {

  constructor() {
    super();
    this.socket = io();
    this.socket.on('error', this.onError.bind(this));
  }

  /**
   * TODO: support for files?
   * TODO: timeout
   */
  sendMutation(mutationRequest) {
    this.sendMyQuery({
      id: mutationRequest.getID(),
      query: mutationRequest.getQueryString(),
      variables: mutationRequest.getVariables(),
      resolve: (result) => mutationRequest.resolve(result),
    });
  }

  sendQueries(queryRequests) {
    for (const request of queryRequests) {
      this.sendMyQuery({
        id: request.getID(),
        query: request.getQueryString(),
        variables: request.getVariables(),
        resolve: (result) => request.resolve(result),
      });
    }
  }

  sendMyQuery({id, query, variables, resolve}) {
    this.socket.emit('query', {id, query, variables});
    this.socket.once('query_response:' + id, (resp) => resolve({response: resp.data}));
  }

  supports(...options) {
    return false;
  }

  onError(err) {
    // TODO: do something better with it
    console.error(err);
    throw err;
  }

}

export default SocketIoNetworkLayer;
