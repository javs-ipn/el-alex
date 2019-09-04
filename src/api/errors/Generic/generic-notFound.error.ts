import { HttpError } from 'routing-controllers';

export class GenericNotFoundError extends HttpError {
    constructor(className: string, id: number) {
        if (id !== undefined) {
            super(404, `Entity ${className} with identifier ${id} does not exist`);
        } else {
            super(404, `No entities ${className} found`);
        }

    }
}
