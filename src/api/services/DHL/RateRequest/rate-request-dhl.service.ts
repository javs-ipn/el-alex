import * as _ from 'lodash';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DHLOptions } from '../../../types/DHL/Options/dhl-options.interface';
import { HashService } from '../../Hash/hash-methods.service';
import { Logger, LoggerInterface } from '../../../../decorators/Logger';
import { RateRequestObjectDHL } from '../../../types/DHL/Rate/RateRequest/dhl-rate-request-object.interface';
import { Service } from 'typedi';

@Service()
export class DHLApiService {

    public static CURRENCY = 'MXN';
    public static COUNTRY_OF_MANOFACTURE = 'MX';
    public static DROPOFFTYPE = 'REGULAR_PICKUP';
    public static UNIT_OF_MEASUREMENT = 'SI';
    public static PAYMENT_INFO = 'DDP';
    public static MANIFEST_BYPASS = 'N';
    public static PACKAGES_NUMBER = 1;

    constructor(
        private hashService: HashService,
        @Logger(__filename) private log: LoggerInterface
    ) {
    }

    public async rateRequest(rateRequest: RateRequestObjectDHL, options: DHLOptions): Promise<any> {
        this.log.debug('Calling for dhl api rate request');
        const hashedString = this.hashService.basicUsernamePassword(options.username, options.password);
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${hashedString}`,
            },
        };
        const dhlRateRequest: AxiosPromise<any> = axios.post(options.apiURL, rateRequest, axiosRequestConfig);
        return await dhlRateRequest
            .then((results: AxiosResponse<any>) => {
                const rateResponse: any = results;
                return Promise.resolve(rateResponse);
            }).catch((error) => {
                if (!_.has(error, 'request')) {
                    throw error.message;
                } else {
                    throw error.response.data;
                }
            });
    }

}
