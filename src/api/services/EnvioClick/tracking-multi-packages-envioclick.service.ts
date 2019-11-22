import * as _ from 'lodash';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
// import { HashService } from '../Hash/hash-methods.service';
import { Logger, LoggerInterface } from '../../../decorators/Logger';
import { Service } from 'typedi';
import { Credential } from '../../models/Credential/Credential';
import { TrackingRequestEnvioClick } from 'src/api/types/EnvioClick/TrackingRequest/envioclick-tracking-request.interface';
import { GenericTrakingObject } from 'src/api/types/RateRequest/generic-traking-object.class';
import { TrackingMultiPackagesEnvioClick } from 'src/api/types/EnvioClick/TrackingRequestMulti/envioclick-tracking-multi.interface';

@Service()
export class TrackingMultiEnvioClickService {
    constructor(
        // private hashService: HashService,
        @Logger(__filename) private log: LoggerInterface
    ) {
    }

    /**
     * @description Calls for DHL api shipment request chaining promises and resolves them
     * @param {ShipmentRequest} shipmentRequest Shipment Request object needed by DHL
     * @param {Credential} credential Object containing the url, username and password
     */
    public async trackingRequest(trackingRequest: TrackingRequestEnvioClick, credential: Credential): Promise<any> {
        this.log.debug('calling for dhl api shipment request');
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${credential.password}`,
            },
        };
        const dhlShipmentRequest: AxiosPromise<any> = axios.post(credential.courier.shipmentRequestUrl, trackingRequest, axiosRequestConfig);
        return await dhlShipmentRequest
            .then((results: AxiosResponse<any>) => {
                const shipmentResponse: any = results.data;
                return Promise.resolve(shipmentResponse);
            }).catch((error) => {
                if (!_.has(error, 'request')) {
                    throw error.message;
                } else {
                    throw error.response.data;
                }
            });
    }

    /**
     * @description Creates a DHL shipment request object
     * @param {Rate} rate - generic shipment object
     * @returns {Promise<ShipmentRequestObjectDHL>} - DHL shipment request object
     */
    public generateObject(genericTracking: GenericTrakingObject): Promise<TrackingRequestEnvioClick> {
        const trackingRequest: TrackingMultiPackagesEnvioClick = {
            trackingCode: genericTracking.waybill,
        };

        return Promise.resolve(trackingRequest);
    }

}
