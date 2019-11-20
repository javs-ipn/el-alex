// import { GenericBussinessLogicError } from '../../errors/Generic/generic-bussinessLogic.error';
// import { FedexNotificationResponse } from '../../errors/Fedex/';

export class HandlerErrorFedex {
    public static AUTH_FAILED = { code: '1000', description: 'Authentication Failed', translateConstant: 'FEDEX_AUTH_FAILED' };
    public static TRACKING_NUMBER_NOT_FOUND = { code: '9040', description: '', translateConstant: 'FEDEX_TRACKING_NUMBER_NOT_FOUND' };
    public static API_NOT_AVAILABLE = {
        code: '9006', description: 'Unable to invoke method: track. Service is currently unavailable.',
        translateConstant: 'FEDEX_API_NOT_AVAILABLE',
    };

    /**
     * @description
     * @param {FedexNotificationResponse}message
     */
    // public static handlerRequestError(message: FedexNotificationResponse): void {
    //     if (this.API_NOT_AVAILABLE.code === message.Code) {
    //         throw new GenericBussinessLogicError(this.API_NOT_AVAILABLE.translateConstant, [this.API_NOT_AVAILABLE]);
    //     } else if (this.TRACKING_NUMBER_NOT_FOUND.code === message.Code) {
    //         throw new GenericBussinessLogicError(this.TRACKING_NUMBER_NOT_FOUND.translateConstant, [this.TRACKING_NUMBER_NOT_FOUND]);
    //     } else if (this.AUTH_FAILED.code === message.Code) {
    //         throw new GenericBussinessLogicError(this.AUTH_FAILED.translateConstant, [this.AUTH_FAILED]);
    //     } else {
    //         throw new GenericBussinessLogicError(message.Message, [message]);
    //     }
    // }
}
