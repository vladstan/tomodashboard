import SocketIoNetworkLayer from './SocketIoNetworkLayer';

class SubsNetworkLayer extends SocketIoNetworkLayer {

  constructor() {
    super();

    this.socket.on('subscription_update', ::this.onSubscriptionUpdate);
    this.socket.on('subscription_closed', ::this.onSubscriptionClosed);

    // all the pending requets
    this.requests = new Map(); // subscriptionId -> requestObj
  }

  onSubscriptionUpdate({id, data, errors}) {
    console.log('on subscription update', id, data, errors);

    const request = this.requests.get(id);
    if (!request) return;

    if (errors) {
      request.onError(errors);
    } else {
      request.onNext(data);
    }
  }

  onSubscriptionClosed({id}) {
    console.log('on subscription closed', id);

    const request = this.requests.get(id);
    if (!request) {
      console.log('!request');
      return;
    }

    console.log(`Subscription ${id} is completed`);
    request.onCompleted();
    this.requests.delete(id);
  }

  onError(error) {
    // notify every pending request
    for (const request of this.requests.values()) {
      request.onError(error);
    }

    super.onError(error);
  }

  sendSubscription(request) {
    const id = request.getClientSubscriptionId();
    this.requests.set(id, request);

    this.socket.emit('subscribe', {
      id,
      query: request.getQueryString(),
      variables: request.getVariables(),
    });

    return {
      dispose() {
        console.log(`disposing ${request.getDebugName()}:${id}`);
        this.socket.emit('unsubscribe', {id});
      },
    };
  }

  disconnect() {
    this.socket.disconnect();

    // complete every pending request
    for (const request of this.requests.values()) {
      request.onCompleted();
    }
  }

}

export default SubsNetworkLayer;
