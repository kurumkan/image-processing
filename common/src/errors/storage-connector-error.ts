import { CustomError } from "./custom-error";

export class StorageConnectorError extends CustomError {
    statusCode = 500;
    reason = 'Error connecting to file storage';

    constructor() {
        super('Error connecting to file storage');
        Object.setPrototypeOf(this, StorageConnectorError.prototype);
    }

    serializeErrors() {
        return [
            { message: this.reason }
        ]
    }
}
