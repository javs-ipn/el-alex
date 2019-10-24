import * as _ from 'lodash';
import { CustomRedpackCoverageResponse } from './../../types/Redpack/custom-redpack-response.interface';
import { CustomRedpackInsuredResponse } from './../../types/Redpack/custom-insured-response.interface';
import { CustomRedpackLabelResponse } from '../../types/Redpack/custom-label-response.interface';
import { HandlerErrorRedpack } from '../../types/Redpack/handler-error-redpack.class';
import { Rate } from '../../models/Rate/rate.model';
export class RedpackBaseService {
    public static SUCCESS_CODE_REDPACK = '1';
    public static WAYBILLNUMBER_ALREADY_IN_USE_REDPACK = '7';
    public static WAYBILLNUMBER_ALREADY_INSURED = '143';

    /**
     * @description Handles the response for redpack error
     * @param {CustomRedpackLabelResponse[]} customResponse Shipment response from redpack
     */
    public handleLabelResponse(customResponse: CustomRedpackLabelResponse[]): void {
        _.forEach(customResponse, (customResponseObject: CustomRedpackLabelResponse) => {
            if (customResponseObject.messages.resultCode !== RedpackBaseService.SUCCESS_CODE_REDPACK
                && customResponseObject.messages.resultCode !== RedpackBaseService.WAYBILLNUMBER_ALREADY_IN_USE_REDPACK) {
                HandlerErrorRedpack.handler(customResponseObject.messages);
            }
        });
    }

    /**
     * @description - Searches for an error received from redpack
     * @param {CustomRedpackCoverageResponse[]} coverageResponse - custom coverage responses
     */
    public handleCoverageResponse(coverageResponse: CustomRedpackCoverageResponse[]): void {
        _.forEach(coverageResponse, (coverageResponseObject: CustomRedpackCoverageResponse) => {
            if (coverageResponseObject.messages.resultCode !== RedpackBaseService.SUCCESS_CODE_REDPACK
                && coverageResponseObject.messages.resultCode !== RedpackBaseService.WAYBILLNUMBER_ALREADY_IN_USE_REDPACK) {
                HandlerErrorRedpack.handler(coverageResponseObject.messages);
            }
        });
    }

    /**
     * @description - Searches for an error received from redpack
     * @param {CustomRedpackInsuredResponse[]} insuredResponse - custom coverage responses
     */
    public handleInsuredResponse(insuredResponse: CustomRedpackInsuredResponse[]): void {
        _.forEach(insuredResponse, (insuredResponseObject: CustomRedpackInsuredResponse) => {
            if (insuredResponseObject.messages.resultCode !== RedpackBaseService.SUCCESS_CODE_REDPACK
                && insuredResponseObject.messages.resultCode !== RedpackBaseService.WAYBILLNUMBER_ALREADY_INSURED) {
                HandlerErrorRedpack.handler(insuredResponseObject.messages);
            }
        });
    }

    /**
     * @description Gets element to insured  add a SOAP request
     * @param {Rate} rate
     * @returns {string} Returns <xsd:valorDeclarado> element.
     */
    public shipmentInsuredXMLString(rate: Rate): string {
        let insuredString = '';
        if (rate.insurance) {
            insuredString = `<xsd:valorDeclarado>${rate.customsValue}</xsd:valorDeclarado>`;
        }
        return insuredString;
    }
}
