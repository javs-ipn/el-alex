import * as _ from 'lodash';
import { Logger, LoggerInterface } from '../../../decorators/Logger';
import { Service } from 'typedi';
import axios, { AxiosRequestConfig } from 'axios';
import { GenericRateObject } from 'src/api/types/RateRequest/generic-rate-object.class';
import { Credential } from '../../models/Credential/Credential';
import { EnvioClickRateRequest } from '../../types/EnvioClick/RateRequest/envioclick-rate-request.interface';
import { EnvioClickRateResponse } from '../../types/EnvioClick/RateResponse/envioclick-rate-response.interface';
import { Courier } from '../../models/Courier/Courier';
import { Rate } from '../../types/EnvioClick/RateResponse/rate.interface';
import { GenericRateResponse } from 'src/api/types/RateResponse/generic-rate-response.interface';
import { CourierRate } from 'src/api/types/RateResponse/courier-rate.interface';
import { RateCourierServiceType } from 'src/api/types/RateResponse/rate-courier-service-type.interface';
import * as moment from 'moment';
import { HandlerErrorEnvioClick } from '../../errors/EnvioClick/handle-error-envioclick.error.class';
import { EnvioClickErrorResponse } from '../../types/EnvioClick/RateResponse/ErrorResponse/error-response-envioclick.interface';

const DAYS_STRING = 'days';
@Service()
export class EnvioClickRateService {

    public static UNIT_OF_MEASUREMENT = 'SI';
    public static PAYMENT_INFO = 'DDP';
    public static ERROR_STATUS = 'NOT OK';

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
        try {
            const axiosRequestConfig = this.getAxiosRequestConfig(credential);
            const rateReponseEnvioClickApi = await axios.post(credential.courier.rateRequestUrl, rateRequest, axiosRequestConfig);
            const rateResponse: EnvioClickRateResponse =  rateReponseEnvioClickApi.data;
            return Promise.resolve(rateResponse);
        } catch (error) {
            this.handleEnvioClickError(error.response.data);
        }
    }

    public getAxiosRequestConfig(credential: Credential): AxiosRequestConfig {
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${credential.password}`,
            },
        };

        return axiosRequestConfig;
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
    public getGenericRateResponse(rateResponse: EnvioClickRateResponse, courier: Courier): Promise<GenericRateResponse> {
        const genericRateResponse: GenericRateResponse = {
            rates: [],
        };
        const courierRate: CourierRate = {
            name: '',
            services: [],
        };
        const auxRate: RateCourierServiceType = {
            rateId: 0,
            serviceName: '',
            currency: '',
            amount: 0,
            estimatedDeliveryDate: '',
            chargesDetail: [],
        };

        _.forEach(rateResponse.data.rates, (rate: Rate) => {
            auxRate.serviceName = rate.product;
            auxRate.currency = rate.product;
            auxRate.amount = rate.total;
            auxRate.currency = undefined;
            auxRate.chargesDetail = undefined;
            auxRate.estimatedDeliveryDate = moment().add(Number(rate.deliveryDays), DAYS_STRING).toISOString();
            courierRate.services.push(auxRate);
        });
        courierRate.name = courier.name;
        genericRateResponse.rates.push(courierRate);

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

    /**
     * @description Inspect if response contains errors and throws exception if found it.
     * @param {rateResponse} EnvioClickRateResponse The response request data.
     * @returns {void}
     */
    public handleEnvioClickError(errorResponse: EnvioClickRateResponse): void {
        console.log(errorResponse.error);
        const errorData: EnvioClickErrorResponse = {
            status: errorResponse.status,
            status_messages: errorResponse.status_messages,
            status_codes: errorResponse.status_codes,
            error: errorResponse.error,
        };
        if (EnvioClickRateService.ERROR_STATUS === errorData.status) {
            HandlerErrorEnvioClick.handlerRequestError(errorResponse);
        }
    }
}
