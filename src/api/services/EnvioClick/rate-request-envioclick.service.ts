import * as _ from 'lodash';
import {Logger, LoggerInterface} from '../../../decorators/Logger';
import {Service} from 'typedi';
import axios, {AxiosPromise, AxiosRequestConfig, AxiosResponse} from 'axios';
import {GenericRateObject} from 'src/api/types/RateRequest/generic-rate-object.class';
import {Credential} from '../../models/Credential/Credential';
import {EnvioClickRateRequest} from '../../types/EnvioClick/RateRequest/envioclick-rate-request.interface';
import {EnvioClickRateResponse} from '../../types/EnvioClick/RateResponse/envioclick-rate-response.interface';
import {Courier} from '../../models/Courier/Courier';
import {RateResponse} from '../../types/RateResponse/GenericRate/rate.response.interface';
import {Rate} from '../../types/EnvioClick/RateResponse/rate.interface';
import {RateInfo} from '../../types/RateResponse/GenericRate/rate-info.interface';

@Service()
export class RateRequestEnvioClickService {

    public static UNIT_OF_MEASUREMENT = 'SI';
    public static PAYMENT_INFO = 'DDP';

    constructor(
        // private hashService: HashService,
        @Logger(__filename) private log: LoggerInterface
    ) {
    }

    /**
     * @description Calls to EnvioClick RateRequest Webservice
     * @param {string} rateRequestString - EnvioClick rate request string
     * @param {Courier} courier - Related tenant courier
     * @returns {Promise<any>} - EnvioClick WS response
     */
    public async rateRequest(rateRequest: EnvioClickRateRequest, credential: Credential): Promise<any> {
        this.log.debug('Calling for EnvioClick api rate request');
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${credential.password}`,
            },
        };
        const apiEnvioClickRateResponse: AxiosPromise<any> = axios.post(credential.courier.rateRequestUrl, rateRequest, axiosRequestConfig);
        return await apiEnvioClickRateResponse
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
     * @description Convert EnvioClickRateResponse to RateResponse
     * @param {EnvioClickRateResponse} rateResponse - EnvioClick rate response
     * @param {Courier} courier
     * @returns {Promise<RateRequestObjectEnvioClick>} - generic rate response object
     */
    public getGenericRateResponse(rateResponse: EnvioClickRateResponse, courier: Courier): Promise<RateResponse> {
        const genericRateResponse: RateResponse = {
            data: {
                courierName: courier.name,
                packageInfo: {
                    height: rateResponse.data.package.height,
                    length: rateResponse.data.package.length,
                    weight: rateResponse.data.package.weight,
                    width: rateResponse.data.package.width,
                },
                originZipCode: rateResponse.data.originZipCode,
                destinationZipCode: rateResponse.data.destinationZipCode,
                insurance: {
                    amountInsurance: rateResponse.data.insurance.amountInsurance,
                    contentValue: rateResponse.data.insurance.contentValue,
                },
                rates: [],
            },
        };

        const auxRate: RateInfo = {
            deliveryTimeHours: '',
            deliveryType: '',
            serviceDesc: '',
            serviceName: '',
            totalAmount: 0,
            additionalCharges: [],
        };

        _.forEach(rateResponse.data.rates, (rate: Rate) => {
            auxRate.serviceName = rate.product;
            auxRate.deliveryType = rate.deliveryType;
            auxRate.totalAmount = rate.total;
            auxRate.deliveryTimeHours = rate.deliveryDays.toString();
            genericRateResponse.data.rates.push(auxRate);
        });

        return Promise.resolve(genericRateResponse);
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
