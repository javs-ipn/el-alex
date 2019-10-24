import { HttpError } from 'routing-controllers';

export class BussinessLogicError extends HttpError {
    constructor(reason?: string) {
        super(409, reason);
    }
}
