import { HttpError } from 'routing-controllers';
import { ValidationError } from 'class-validator';

export class GenericValidationError extends HttpError {
    public validationErrors: ValidationError[];
    constructor(message: string, validationErros: ValidationError[]) {
        super(400, message);
        this.validationErrors = validationErros;
    }
}
