import * as _ from 'lodash';
// import { HashService } from '../Hash/hash-methods.service';
import { Logger, LoggerInterface } from '../../../decorators/Logger';
import { Service } from 'typedi';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { GenericRateObject } from 'src/api/types/RateRequest/generic-rate-object.class';
import { Credential } from '../../models/Credential/Credential';
import { MultiRateRequestEnvioClick } from 'src/api/types/EnvioClick/RateRequestMultiPackages/envioclick-request.interface';
import { RatePackage } from 'src/api/types/EnvioClick/RateRequestMultiPackages/envioclick-rate-package.interface';

@Service()
export class MultiRateEnvioClickService {

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
    public async rateRequest(rateRequest: MultiRateRequestEnvioClick, credential: Credential): Promise<any> {
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
     * @description Creates a DHL rate request object
     * @param {string} genericRateObject - generic rate object
     * @returns {Promise<RateRequestObjectDHL>} - DHL rate request object
     */
    public generateObject(genericRateObject: GenericRateObject): Promise<MultiRateRequestEnvioClick> {
        // TODO - get credential by tenantID
        // const customerCredential = JSON.parse(this.getCredentialOptionsByTenant(genericRateObject.tenantId));
        const rateRequestEnvioClick: MultiRateRequestEnvioClick = {
            packages: [],
            destination_zip_code: genericRateObject.recipientLocation.zipcode,
            origin_zip_code: genericRateObject.shipperLocation.zipcode,
        };

        const requestedPackage: RatePackage = {
            contentValue: 0,
            description: '',
            height: 0,
            length: 0,
            weight: 0,
            width: 0,
        };

        _.forEach(genericRateObject.packages, (packageObject, index) => {
            requestedPackage.contentValue = packageObject.customsValue;
            requestedPackage.description = packageObject.description;
            requestedPackage.height = packageObject.packageInfo.height;
            requestedPackage.length = packageObject.packageInfo.length;
            requestedPackage.weight = packageObject.packageInfo.weight;
            requestedPackage.width = packageObject.packageInfo.width;

            rateRequestEnvioClick.packages.push(requestedPackage);
        });

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
