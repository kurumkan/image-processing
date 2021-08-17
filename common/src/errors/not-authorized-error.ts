import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  private static message = 'Not authorized';

  constructor() {
    super(NotAuthorizedError.message);
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{
      message: NotAuthorizedError.message
    }];
  }
}