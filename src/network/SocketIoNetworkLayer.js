import debug from 'debug';
import timeout from 'callback-timeout';

import SessionExpiredError from '../errors/SessionExpiredError';
import SocketAckTimeoutError from '../errors/SocketAckTimeoutError';

import BaseNetworkLayer from './BaseNetworkLayer';

const log = debug('tomo:relay:network:SocketIoNetworkLayer');
const SOCKETIO_ACK_TIMEOUT = 10 * 1000; // 10s

class SocketIoNetworkLayer extends BaseNetworkLayer {

  constructor(socket) {
    super();
    this.socket = socket;
    this.socket.on('error', ::this.onError);
  }

  sendMutation(mutationRequest) {
    const payload = {
      query: mutationRequest.getQueryString(),
      variables: mutationRequest.getVariables(),
    };
    log('sending mutation request', payload);
    this.askQuery(payload, mutationRequest);
  }

  sendQueries(queryRequests) {
    for (const request of queryRequests) {
      const payload = {
        query: request.getQueryString(),
        variables: request.getVariables(),
      };

      log('sending query request', payload);
      this.askQuery(payload, request);
    }
  }

  askQuery(payload, request) {
    const ackCallback = timeout((errorOrResult) => {
      if (errorOrResult instanceof Error) {
        // custom timeout error
        if (errorOrResult.code === 'ETIMEOUT') {
          errorOrResult = new SocketAckTimeoutError(undefined, payload);
        }

        request.reject(errorOrResult);
        return;
      }

      // no error -> first arg must be the result
      const result = errorOrResult;

      if (result && result.errors) {
        request.reject(createRequestError(request, result.errors));
      } else if (result && result.data) {
        request.resolve({response: result.data});
      } else {
        request.reject(new Error('Empty result, check the emitted error(s)'));
      }
    }, SOCKETIO_ACK_TIMEOUT);
    this.socket.emit('query', payload, ackCallback);
  }

  supports(...options) {
    return false;
  }

  onError(err) {
    console.error('socket error:', err);
  }

}

function createRequestError(request, errors) {
  // known errors
  if (errors.find((e) => e.message === 'jwt expired')) {
    return new SessionExpiredError();
  }

  // unknown errors
  const reason = JSON.stringify(errors, null, 2);
  const error = new Error(
    `Server request for mutation/query "${request.getDebugName()}" ` +
    `failed for the following reasons:\n\n${reason}`
  );
  error.source = errors;
  return error;
}

export default SocketIoNetworkLayer;
