import * as _ from 'lodash';
// import { HashService } from '../Hash/hash-methods.service';
import { Logger, LoggerInterface } from '../../../decorators/Logger';
import { Service } from 'typedi';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { GenericRateObject } from 'src/api/types/RateRequest/generic-rate-object.class';
import { Credential } from '../../models/Credential/Credential';
import {EnvioClickRateRequest} from '../../types/EnvioClick/RateRequest/envioclick-rate-request.interface';

@Service()
export class RateRequestEnvioClickService {

    public static UNIT_OF_MEASUREMENT = 'SI';
    public static PAYMENT_INFO = 'DDP';

    constructor(
        // private hashService: HashService,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    /**
     * @description Calls to EnvioClick RateRequest Webservice
     * @param {string} rateRequestString - EnvioClick rate request string
     * @param {Courier} courier - Related tenant courier
     * @returns {Promise<any>} - EnvioClick WS response
     */
    public async rateRequest(rateRequest: EnvioClickRateRequest, credential: Credential): Promise<any> {
        this.log.debug('Calling for EnvioClick api rate request');
        /// const hashedString = this.hashService.basicUsernamePassword(credential.username, credential.password);
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${credential.password}`,
            },
        };
        const EnvioClickRateRequest: AxiosPromise<any> = axios.post(credential.courier.rateRequestUrl, rateRequest, axiosRequestConfig);
        return await EnvioClickRateRequest
            .then((results: AxiosResponse<any>) => {
                const rateResponse: any = results.data;
                return Promise.resolve(rateResponse);
            }).catch((error) => {
                if (!_.has(error, 'request')) {
                    throw error.message;
                } else {
                    throw error.response.data;
                }
            });
    }

    /**
     * @description Creates a EnvioClick rate request object
     * @param {string} genericRateObject - generic rate object
     * @returns {Promise<RateRequestObjectEnvioClick>} - EnvioClick rate request object
     */
    public generateObject(genericRateObject: GenericRateObject): Promise<EnvioClickRateRequest> {
        // TODO - get credential by tenantID
        // const customerCredential = JSON.parse(this.getCredentialOptionsByTenant(genericRateObject.tenantId));
        const firstPackage = _.first(genericRateObject.packages);
        const rateRequestEnvioClick: EnvioClickRateRequest = {
            package: {
                contentValue: firstPackage.customsValue,
                description: firstPackage.description,
                height: firstPackage.packageInfo.height,
                length: firstPackage.packageInfo.length,
                weight: firstPackage.packageInfo.weight,
                width: firstPackage.packageInfo.width,
            },
            destination_zip_code: genericRateObject.recipientLocation.zipcode,
            origin_zip_code: genericRateObject.shipperLocation.zipcode,
        };

        return Promise.resolve(rateRequestEnvioClick);
    }

    /**
     * @description - get credential options by tenandId
     * @param {string} tenantId - Tenant related to the credential
     * @returns {JSON string>} -response in JSON string
     */
    public getCredentialOptionsByTenant(tenantId: string): string {
        const credential = '{"Account": 980129458}';
        return credential;
    }
}
