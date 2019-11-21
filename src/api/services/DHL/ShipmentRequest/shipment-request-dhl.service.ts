import * as _ from 'lodash';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DHLBaseService } from '../Base/base-dhl.service';
import { DHLOptions } from './../../../types/DHL/Options/dhl-options.interface';
import { HashService } from './../../Hash/hash-methods.service';
import { Notification } from './../../../types/DHL/Rate/RateResponse/dhl-notification.interface';
import { Service } from 'typedi';
import { ShipmentRequestObject } from './../../../types/DHL/Shipment/ShipmentRequest/dhl-shipment-request.interface';
import { ShipmentResponseObject } from './../../../types/DHL/Shipment/ShipmentResponse/dhl-shipment-response-object.interface';
@Service()
export class DHLShipmentService extends DHLBaseService {

    constructor(private hashService: HashService) {
        super();
    }

    /**
     * @description Calls for DHL api shipment request chaining promises and resolves them
     * @param {ShipmentRequest} shipmentRequest Shipment Request object needed by DHL
     * @param {DHLOptions} options Object containing the url, username and password
     * @param {number} labelNumber Label quantity to be requested
     */
    public async shipmentRequest(shipmentRequest: ShipmentRequestObject, options: DHLOptions, labelNumber: number): Promise<ShipmentResponseObject[]> {
        const hashedString = this.hashService.basicUsernamePassword(options.username, options.password);
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${hashedString}`,
            },
        };
        const dhlShipmentRequest: Array<AxiosPromise<any>> = [];
        for (let waybill = 0; waybill < labelNumber; waybill++) {
            const axiosRequest = axios.post(options.url, shipmentRequest, axiosRequestConfig);
            dhlShipmentRequest.push(axiosRequest);
        }
        return await Promise.all(dhlShipmentRequest)
            .then((results: Array<AxiosResponse<any>>) => {
                const shipmentResponse: ShipmentResponseObject[] = [];
                results.forEach((axiosResponse: AxiosResponse<any>) => {
                    shipmentResponse.push(axiosResponse.data);
                });
                this.handleNotificationReponseError(shipmentResponse);
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
    private handleNotificationReponseError(shipmentResponse: ShipmentResponseObject[]): void {
        _.forEach(shipmentResponse, (shipmentResponseObject: ShipmentResponseObject) => {
            _.forEach(shipmentResponseObject.ShipmentResponse.Notification, (notification: Notification) => {
                this.throwBussinessError(notification);
            });
        });
    }

}
