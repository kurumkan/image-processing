import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  errors: ValidationError[];
  statusCode = 400;
  
  constructor(errors: ValidationError[]) {
    super('Invalid request parameters');
    
    // because we are extending a build in class(Error)
    Object.setPrototypeOf(this, RequestValidationError.prototype);

    this.errors = errors;
  }

  serializeErrors() {
    return this.errors.map(e => ({
      message: e.msg,
      field: e.param       
    }));
  }
}
