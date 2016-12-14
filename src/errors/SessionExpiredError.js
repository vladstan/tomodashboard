import ExtendableError from './ExtendableError';

class SessionExpiredError extends ExtendableError {

  constructor(message = 'Login session has expired') {
    super(message);
  }

}

export default SessionExpiredError;
