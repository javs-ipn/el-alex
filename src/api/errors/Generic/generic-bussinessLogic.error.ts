import { HttpError } from 'routing-controllers';

export class GenericBussinessLogicError extends HttpError {
    public errors: any;
    constructor(message: string, errors?: any) {
        super(409, message);
        this.errors = errors ? errors : [];
    }
}
