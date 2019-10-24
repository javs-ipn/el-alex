import { MessagesResponse } from './messages-response.interface';
import { BussinessLogicError } from '../../../api/errors/BusinessLogicError';

const REDPACK_API_NOT_AVAILABLE = {code: '2', description: 'ERROR EN EJECUCIÓN DEL SERVICIO REDPACKAPI', translateConstant: 'REDPACK_API_NOT_AVAILABLE'};
export class HandlerErrorRedpack {

    /**
     * @description handler error RedPack API
     * @param {MessagesResponse} messagesRespose
     */
    public static handler(messagesRespose: MessagesResponse): void {
        let error: string;
        if (messagesRespose.resultCode === REDPACK_API_NOT_AVAILABLE.code && messagesRespose.messageDescription === REDPACK_API_NOT_AVAILABLE.description) {
            error = REDPACK_API_NOT_AVAILABLE.translateConstant;
        } else {
            error = messagesRespose.messageDescription;
        }
        throw new BussinessLogicError(error);
    }
}
