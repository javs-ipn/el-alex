import * as _ from 'lodash';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DHLOptions } from '../../../types/DHL/Options/dhl-options.interface';
import { GenericBussinessLogicError } from '../../../errors/Generic/generic-bussinessLogic.error';
import { HashService } from '../../Hash/hash-methods.service';
import { Logger, LoggerInterface } from '../../../../decorators/Logger';
import { Notification } from '../../../types/DHL/Shipment/ShipmentResponse/dhl-notification.interface';
import { Service } from 'typedi';
import { ShipmentRequestObject } from '../../../types/DHL/Shipment/ShipmentRequest/dhl-shipment-request.interface';
import { ShipmentResponseObject } from '../../../types/DHL/Shipment/ShipmentResponse/dhl-shipment-response-object.interface';

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

    /**
     * @description Calls for DHL api shipment request chaining promises and resolves them
     * @param {ShipmentRequest} shipmentRequest Shipment Request object needed by DHL
     * @param {DHLOptions} options Object containing the url, username and password
     * @param {number} labelNumber Label quantity to be requested
     */
    public async shipmentRequest(shipmentRequest: ShipmentRequestObject, options: DHLOptions, labelsToGenerate: number): Promise<ShipmentResponseObject[]> {
        this.log.debug('calling for dhl api shipment request');
        const hashedString = this.hashService.basicUsernamePassword(options.username, options.password);
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${hashedString}`,
            },
        };
        const dhlShipmentRequest: Array<AxiosPromise<any>> = [];
        for (let waybill = 0; waybill < labelsToGenerate; waybill++) {
            const axiosRequest = axios.post(options.apiURL, shipmentRequest, axiosRequestConfig);
            dhlShipmentRequest.push(axiosRequest);
        }
        return await Promise.all(dhlShipmentRequest)
            .then((results: Array<AxiosResponse<any>>) => {
                const shipmentResponse: ShipmentResponseObject[] = [];
                results.forEach((axiosResponse: AxiosResponse<any>) => {
                    shipmentResponse.push(axiosResponse.data);
                });
                this.handleShipmentRequestNotificationReponseError(shipmentResponse);
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
     * @description Handles the response from dhl api service Thrown bussiness errors if found
     * @param {ShipmentResponseObject[]} shipmentResponse response object
     * @returns {void}
     */
    private handleShipmentRequestNotificationReponseError(shipmentResponse: ShipmentResponseObject[]): void {
        _.forEach(shipmentResponse, (shipmentResponseObject: ShipmentResponseObject) => {
            _.forEach(shipmentResponseObject.ShipmentResponse.Notification , (notification: Notification) => {
                if (notification['@code'] !== '0') {
                    throw new GenericBussinessLogicError(notification.Message);
                }
            });
        });
    }

}
