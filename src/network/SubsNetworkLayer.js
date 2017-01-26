import debug from 'debug';

import SocketIoNetworkLayer from './SocketIoNetworkLayer';

const log = debug('tomo:relay:network:SubsNetworkLayer');

class SubsNetworkLayer extends SocketIoNetworkLayer {

  constructor(socket) {
    super(socket);

    this.socket.on('subscription_updated', ::this.onSubscriptionUpdated);
    this.socket.on('subscription_closed', ::this.onSubscriptionClosed);

    // all pending requets
    this.requests = new Map(); // subscriptionId -> requestObj
  }

  onSubscriptionUpdated({id, data, errors}) {
    log('on subscription updated', id, data, errors);

    const request = this.requests.get(id);
    if (!request) return;

    if (errors) {
      request.onError(errors);
    } else {
      request.onNext(data);
    }
  }

  onSubscriptionClosed({id}) {
    log('on subscription closed', id);

    const request = this.requests.get(id);
    if (!request) return;

    log(`subscription ${id} is completed`);
    request.onCompleted();
    this.requests.delete(id);
  }

  sendSubscription(request) {
    const id = request.getClientSubscriptionId();
    this.requests.set(id, request);

    log(`subscribing ${request.getDebugName()}:${id}`);
    this.socket.emit('subscribe', {
      id,
      query: request.getQueryString(),
      variables: request.getVariables(),
    });

    return {
      dispose: () => {
        log(`disposing ${request.getDebugName()}:${id}`);
        this.socket.emit('unsubscribe', {id});
      },
    };
  }

  disconnect() {
    log('disconnecting...');
    this.socket.disconnect();

    // complete every pending request
    for (const [id, request] of this.requests.entries()) {
      request.onCompleted();
      this.requests.delete(id);
    }
  }

}

export default SubsNetworkLayer;
