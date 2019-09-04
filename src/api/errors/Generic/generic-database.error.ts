import { HttpError } from 'routing-controllers';

export class GenericDatabaseError extends HttpError {
    constructor(message: string) { super(500, message); }
}
