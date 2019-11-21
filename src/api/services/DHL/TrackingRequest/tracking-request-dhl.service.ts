import * as _ from 'lodash';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DHL_CONSTANTS } from '../../../types/DHL/Constants/dhl-constants';
import { DHLOptions } from './../../../types/DHL/Options/dhl-options.interface';
import { GenericBussinessLogicError } from './../../../errors/Generic/generic-bussinessLogic.error';
import { HashService } from './../../Hash/hash-methods.service';
import { Service } from 'typedi';
import { StatusInfo } from './../../../types/DHL/Tracking/TrackingResponse/dhl-tracking-status-info-item.interface';
import { TrackingRequestObject } from './../../../types/DHL/Tracking/TrackingRequest/dhl-tracking-shipment-request-object.interface';
import { TrackShipmentRequestResponseObject } from './../../../types/DHL/Tracking/TrackingResponse/dhl-tracking-shipment-response.interface';

@Service()
export class DHLTrackingService {

    constructor(private hashService: HashService) {
    }

    /**
     * @description Calls for dhl tracking service for single tracking waybill number
     * @param {TrackingRequestObject} trackingRequest Tracking object needed by dhl
     * @param {DHLOptions} options Auth data and url to request
     * @returns {TrackShipmentRequestResponseObject} DHL Response for the request
     */
    public async trackingRequest(trackingRequest: TrackingRequestObject, options: DHLOptions): Promise<TrackShipmentRequestResponseObject> {
        const hashedString = this.hashService.basicUsernamePassword(options.username, options.password);
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${hashedString}`,
            },
        };
        const dhlTrackingRequest: Array<AxiosPromise<any>> = [];
        const axiosRequest = axios.post(options.apiURL, trackingRequest, axiosRequestConfig);
        dhlTrackingRequest.push(axiosRequest);
        return await Promise.all(dhlTrackingRequest)
            .then((results: Array<AxiosResponse<any>>) => {
                const trackingResponse: TrackShipmentRequestResponseObject[] = [];
                results.forEach((axiosResponse: AxiosResponse<any>) => {
                    trackingResponse.push(axiosResponse.data);
                });
                this.handleTrackingResponse(trackingResponse);
                const firstTrackingResponse = _.first(trackingResponse);
                return Promise.resolve(firstTrackingResponse);
            }).catch((error) => {
                if (!_.has(error, 'request')) {
                    throw error.message;
                } else {
                    throw error.response.data;
                }
            });
    }

    /**
     * @description - Handles the dhl response searching for an error to raise a exception
     * @param {TrackShipmentRequestResponseObject[]} shipmentResponse Dhl response gather from webservice
     */
    private handleTrackingResponse(shipmentResponse: TrackShipmentRequestResponseObject[]): void {
        _.forEach(shipmentResponse, (shipmentResponseObject: TrackShipmentRequestResponseObject) => {
            const arrayOfItem = shipmentResponseObject.trackShipmentRequestResponse
                .trackingResponse.TrackingResponse.AWBInfo.ArrayOfAWBInfoItem;
            let status: StatusInfo;
            if (_.isArray(arrayOfItem)) {
                const firstArrayItemStatus = _.first(arrayOfItem).Status;
                status = this.getStatusItem(firstArrayItemStatus);
            } else {
                status = this.getStatusItem(arrayOfItem.Status);
            }
            if (!status || status.ActionStatus !== DHL_CONSTANTS.SUCCESS_CODE) {
                let message = '';
                if (!status) {
                    message = DHL_CONSTANTS.AN_UNDEFINED_STATUS_REACHED;
                } else {
                    message = status.Condition.ArrayOfConditionItem.ConditionData;
                }
                throw new GenericBussinessLogicError(message);
            }
        });
    }

    /**
     * @description - Gets the status info gathered dhl for array or object response
     * @param {StatusInfo | StatusInfo[]} statusInfo - Data gather from response
     * @returns {StatusInfo} - Success status info or first error
     */
    private getStatusItem(statusInfo: StatusInfo | StatusInfo[]): StatusInfo {
        let finalStatusInfo: StatusInfo;
        if (_.isArray(statusInfo)) {
            finalStatusInfo = this.searchForSuccessStatus(statusInfo);
        } else {
            finalStatusInfo = statusInfo;
        }
        return finalStatusInfo;
    }

    /**
     * @description - Searches for success status and return it otherwise first status
     * @param {StatusInfo[]} statusInfoArray  Status info to search in
     * @returns {StatusInfo} - Success status info or first error
     */
    private searchForSuccessStatus(statusInfoArray: StatusInfo[]): StatusInfo {
        let finalStatusInfo: StatusInfo;
        const foundSuccessItem = _.find(statusInfoArray, (statusInfo: StatusInfo) => {
            return statusInfo.ActionStatus === DHL_CONSTANTS.SUCCESS_CODE;
        });
        if (foundSuccessItem) {
            finalStatusInfo = foundSuccessItem;
        } else {
            finalStatusInfo = _.first(statusInfoArray);
        }
        return finalStatusInfo;
    }

}
