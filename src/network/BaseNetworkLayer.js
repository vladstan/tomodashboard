class BaseNetworkLayer {

  sendMutation(mutationRequest) {
    throw new Error('not implemented');
  }

  sendQueries(queryRequests) {
    throw new Error('not implemented');
  }

  supports(...options) {
    throw new Error('not implemented');
  }

}

export default BaseNetworkLayer;
