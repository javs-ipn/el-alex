import * as _ from 'lodash';
import * as XMLJS from 'xml2js';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CustomRedpackInsuredResponse } from './../../types/Redpack/custom-insured-response.interface';
import { Credential } from '../../models/Credential/Credential';
import { RedpackBaseService } from './redpack-base.service';
import { RedpackShipmentService } from './redpack-shipment.service';
import { Service } from 'typedi';

@Service()
export class RedpackInsuredService extends RedpackBaseService {

    public static INSURED_WS_START_LINE = 'ws:aseguraEnvio';

    /**
     * @description Changes the ws definition in favor of redpack asegurarEnvio
     * @param {string[]} shipmentInsureXMLStrings Created xml shipment strings
     * @returns {string[]} insured xml string
     */
    public changeXMLStringToInsureWaybillNumber(shipmentInsureXMLString: string): string {
        const shipmentRegex = new RegExp(RedpackShipmentService.SHIPMENT_WS_START_LINE, 'g');
        const auxilarString = _.clone(shipmentInsureXMLString);
        const insuredString = auxilarString.replace(shipmentRegex, RedpackInsuredService.INSURED_WS_START_LINE);

        return insuredString;
    }

    /**
     * @description Calls the redpack shipment insured request
     * @param {string[]} shipmentInsureXMLStrings shipment strings for the  request
     * @param {CourierService} courierService Delivery service given
     * @returns {Promise<CustomRedpackInsuredResponse[]>} Custom response for the requests
     */
    public async requestShipmentInsuredService(shipmentInsureXMLString: string, credential: Credential): Promise<CustomRedpackInsuredResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/soap+xml',
                'Accept': 'application/json',
            },
        };
        const shipmentRequestArray: Array<AxiosPromise<any>> = [];
        const axiosRequest = axios.post(credential.courier.shipmentRequestUrl, shipmentInsureXMLString, axiosRequestConfig);
        shipmentRequestArray.push(axiosRequest);

        return await Promise.all(shipmentRequestArray)
            .then((results: Array<AxiosResponse<any>>) => {
                const options = { explicitArray: false, tagNameProcessors: [XMLJS.processors.stripPrefix], attrkey: 'rootValue' };
                const shipmentResponses: any[] = [];
                results.forEach(async (axiosResponse: AxiosResponse<any>) => {
                    await XMLJS.parseString(axiosResponse.data, options, async (err, result) => {
                        shipmentResponses.push(result.Envelope.Body.aseguraEnvioResponse.return);
                    });
                });
                const customResponseObject = this.getInsuranceResponse(shipmentResponses);
                this.handleInsuredResponse(customResponseObject);
                return Promise.resolve(customResponseObject);
            }).catch((error) => {
                if (!_.has(error, 'request')) {
                    throw error.message;
                } else {
                    throw error.response.data;
                }
            });
    }

    /**
     * @description Creates an array of custom shipment response to handle easily from estafeta XML response
     * @param {any[]} shipmentResponse Response array in JSON format from XML
     * @returns {CustomRedpackInsuredResponse[]} Custom label response
     */
    private getInsuranceResponse(shipmentResponse: any[]): CustomRedpackInsuredResponse[] {
        const customLabelResponse: CustomRedpackInsuredResponse[] = [];
        _.forEach(shipmentResponse, (labelResponseObject: any) => {
            const customResponse: CustomRedpackInsuredResponse = {
                messages: { messageDescription: '', resultCode: '' },
                insured: true,
            };
            if (_.isArray(labelResponseObject.resultadoConsumoWS)) {
                const firstResult: any = _.first(labelResponseObject.resultadoConsumoWS);
                customResponse.messages.messageDescription = firstResult.descripcion;
                customResponse.messages.resultCode = firstResult.estatus;
            } else {
                customResponse.messages.messageDescription = labelResponseObject.resultadoConsumoWS.descripcion;
                customResponse.messages.resultCode = labelResponseObject.resultadoConsumoWS.estatus;
            }
            customLabelResponse.push(customResponse);
        });
        return customLabelResponse;
    }
}
