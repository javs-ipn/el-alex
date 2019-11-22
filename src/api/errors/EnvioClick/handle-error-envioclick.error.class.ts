import { GenericBussinessLogicError } from '../../errors/Generic/generic-bussinessLogic.error';
import { EnvioClickErrorResponse } from 'src/api/types/EnvioClick/RateResponse/ErrorResponse/error-response-envioclick.interface';
import * as _ from 'lodash';

export class HandlerErrorEnvioClick {
    public static AUTH_FAILED = {
        code: 401,
        description: 'API Key does not exist. This parameter must be sent in the header named '
            + 'Authorization. You can find your API Key in your www.envioclickpro .com account.',
        translateConstant: 'ENVIOCLICK_AUTH_FAILED',
    };
    public static FORBIDDEN = {
        code: 403,
        description: 'Access denied.',
        translateConstant: 'ENVIOCLICK_FORBIDDEN',
    };
    public static ENTITY_ERROR = {
        code: 422,
        description: {},
        translateConstant: 'ENVIOCLICK_ENTITY_ERROR',
    };
    public static UNKNOWN_ERROR = {
        code: 499,
        description: 'An error has occurred. Try again later.',
        translateConstant: 'ENVIOCLICK_UNKNOWN_ERROR',
    };

    /**
     * @description
     * @param {EnvioClickErrorResponse} errorResponse
     */
    public static handlerRequestError(errorResponse: EnvioClickErrorResponse): void {
        const firstErrorStatus: number = _.first(errorResponse.status_codes);
        if (firstErrorStatus === this.AUTH_FAILED.code) {
            throw new GenericBussinessLogicError(this.AUTH_FAILED.translateConstant, [this.AUTH_FAILED]);
        } else if (firstErrorStatus === this.FORBIDDEN.code) {
            throw new GenericBussinessLogicError(this.FORBIDDEN.translateConstant, [this.FORBIDDEN]);
        } else if (firstErrorStatus === this.ENTITY_ERROR.code) {
            this.ENTITY_ERROR.description = errorResponse.status_messages.error;
            throw new GenericBussinessLogicError(this.ENTITY_ERROR.translateConstant, [this.ENTITY_ERROR]);
        } else if (firstErrorStatus === this.UNKNOWN_ERROR.code) {
            throw new GenericBussinessLogicError(this.UNKNOWN_ERROR.translateConstant, [this.UNKNOWN_ERROR]);
        } else {
            throw new GenericBussinessLogicError(firstErrorStatus.toString(), [errorResponse]);
        }
    }
}
