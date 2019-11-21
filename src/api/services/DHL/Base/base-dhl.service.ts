import { DHLCredentialOptions } from './../../../types/Credential/DHL/dhl-credential-options';
import { Credential } from '../../../models/Credential/Credential';
import { DHL_CONSTANTS } from '../../../types/DHL/Constants/dhl-constants';
import { DHLOptions } from './../../../types/DHL/Options/dhl-options.interface';
import { GenericBussinessLogicError } from '../../../errors/Generic/generic-bussinessLogic.error';
import { Notification } from '../../../types/DHL/Rate/RateResponse/dhl-notification.interface';
export class DHLBaseService {

    /**
     * @description - Throws notification
     * @param {Notification} notification - Notification found
     */
    public throwBussinessError(notification: Notification): void {
        if (notification[DHL_CONSTANTS.CODE_VAR_NAME] !== DHL_CONSTANTS.SUCCESS_RESPONSE_CODE) {
            throw new GenericBussinessLogicError(notification.Message);
        }
    }

    /**
     * @description Gets dhl credential instance.
     * @returns {DHLOptions} Returns a unique object.
     */
    public getDHLOptions(url: string, credentialDataByType: Credential): DHLOptions {
        const dhlOptions: DHLOptions = {
            url: '',
            username: '',
            password: '',
            account: '',
        };
        const credentialOptions: DHLCredentialOptions = JSON.parse(credentialDataByType.options);
        dhlOptions.url = url;
        dhlOptions.username = credentialDataByType.username;
        dhlOptions.password = credentialDataByType.password;
        dhlOptions.account = credentialOptions.account;
        return dhlOptions;
    }
}
