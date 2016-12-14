import ExtendableError from './ExtendableError';

class SocketAckTimeoutError extends ExtendableError {

  constructor(message = 'Server took too long to respond', payload) {
    super(message);
    this.payload = payload;
  }

}

export default SocketAckTimeoutError;
