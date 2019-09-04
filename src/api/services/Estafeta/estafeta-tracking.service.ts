import * as XMLJS from 'xml2js';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ConfigOptions } from './../../types/Estafeta/config-options.interface';
import { Credential } from './../../models/Credential/Credential';
import { GenericBussinessLogicError } from './../../errors/Generic/generic-bussinessLogic.error';
import { Service } from 'typedi';

@Service()
export class EstafetaTrackingService {

    public static SEARCH_TYPE = 'L';
    public static WAYBILL_TYPE = 'G';
    public static INCLUDE_DIMENSIONS = '0';
    public static INCLUDE_REPLACE_DATA = '0';
    public static INCLUDE_RETURN_DOCUMENT_DATA = '0';
    public static INCLUDE_MULTIPLE_SERVICE = '0';
    public static INCLUDE_INTERNATIONAL_DATA = '0';
    public static INCLUDE_SIGNATURE = '0';
    public static INCLUDE_CUSTOMER_INFO = '0';
    public static INCLUDE_HISTORY = '1';
    public static HISTORY_TYPE = 'ALL';
    public static FILTER_INFO = '0';
    public static FILTER_TYPE = 'ON_TRANSIT';

    public static headerString =
        `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"`
        + ` xmlns:est="http://www.estafeta.com/">`
        + `<soap:Header/>`
        + `<soap:Body>`
        + `<est:ExecuteQuery>`;
    public static footerString = `</est:ExecuteQuery>`
        + `</soap:Body>`
        + `</soap:Envelope>`;

    /**
     * @description Generates the tracking xml string required by estafeta service
     * @param {string} waybillNumber - Waybill number to search for
     * @param {Credential} credential - Credential found for tenant
     * @returns {string} - estafeta tracking xml string
     */
    public createTrackingXmlString(waybillNumber: string, credential: Credential): string {
        const trackingRequestString =
            `${EstafetaTrackingService.headerString}${this.createConfigString(credential)}`
            + `${this.createTrackingString(waybillNumber)}`
            + `${EstafetaTrackingService.footerString}`;
        return trackingRequestString;
    }

    /**
     * @description Calls for ESTAFETA soap ExecuteQuery and  chaining promises and resolves them
     * @param {string} requestedString XML string needed by the soap call
     * @param {Credential} credential Credential found for tenant
     * @returns
     */
    public async requestTracking(requestedString: string, credential: Credential): Promise<any[]> {

        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'text/xml',
                'Accept': 'application/json',
            },
        };
        const estafetaLabelRequest: Array<AxiosPromise<any>> = [];
        const axiosRequest = axios.post(credential.courier.trackingRequestUrl, requestedString, axiosRequestConfig);
        estafetaLabelRequest.push(axiosRequest);

        return await Promise.all(estafetaLabelRequest)
            .then((results: Array<AxiosResponse<any>>) => {
                const options = { explicitArray: false, tagNameProcessors: [XMLJS.processors.stripPrefix] };
                const trackingResponse: any[] = [];
                results.forEach(async (axiosResponse: AxiosResponse<any>) => {
                    await XMLJS.parseString(axiosResponse.data, options, async (err, result) => {
                        if (err === null) {
                            trackingResponse.push(result.Envelope.Body.ExecuteQueryResponse);
                        }
                    });
                });
                // @TODO - Handle response for bussiness logic
                return Promise.resolve(trackingResponse);
            }).catch((error) => {
                // @TODO - Handle response for errors of Estafeta service
                throw error;
            });
    }

    /**
     * @description Creates the config string required by estafeta service
     * @param {Credential} credential - Credential found for tenant
     * @returns {string} - Config estafeta string
     */
    private createConfigString(credential: Credential): string {
        let configString = '';
        const configOptions = credential.options;
        if (configOptions !== '') {
            const configOptionsObject: ConfigOptions = JSON.parse(credential.options);
            configString = `<est:suscriberId>${configOptionsObject.suscriberId}</est:suscriberId>
            <est:login>${credential.username}</est:login>
            <est:password>${credential.password}</est:password>`;
        } else {
            throw new GenericBussinessLogicError('No configuration options found for ESTAFETA check id =' + credential.courier.id);
        }
        return configString;
    }

    /**
     * @description Creates the estafeta tracking string
     * @param {string} waybillNumber - waybill to search tracking for
     * @returns {string} estafeta tracking string
     */
    private createTrackingString(waybillNumber: string): string {
        let shipmentRequestString = '';
        shipmentRequestString = `
        <est:searchType>
        	  <est:type>${EstafetaTrackingService.SEARCH_TYPE}</est:type>
            <est:waybillList>
               <est:waybillType>${EstafetaTrackingService.WAYBILL_TYPE}</est:waybillType>
               <est:waybills>
                  <est:string>${waybillNumber}</est:string>
               </est:waybills>
            </est:waybillList>
         </est:searchType>
         <est:searchConfiguration>
            <est:includeDimensions>${EstafetaTrackingService.INCLUDE_DIMENSIONS}</est:includeDimensions>
            <est:includeWaybillReplaceData>${EstafetaTrackingService.INCLUDE_REPLACE_DATA}</est:includeWaybillReplaceData>
            <est:includeReturnDocumentData>${EstafetaTrackingService.INCLUDE_RETURN_DOCUMENT_DATA}</est:includeReturnDocumentData>
            <est:includeMultipleServiceData>${EstafetaTrackingService.INCLUDE_MULTIPLE_SERVICE}</est:includeMultipleServiceData>
            <est:includeInternationalData>${EstafetaTrackingService.INCLUDE_INTERNATIONAL_DATA}</est:includeInternationalData>
            <est:includeSignature>${EstafetaTrackingService.INCLUDE_SIGNATURE}</est:includeSignature>
            <est:includeCustomerInfo>${EstafetaTrackingService.INCLUDE_CUSTOMER_INFO}</est:includeCustomerInfo>
            <est:historyConfiguration>
                  <est:includeHistory>${EstafetaTrackingService.INCLUDE_HISTORY}</est:includeHistory>
                  <est:historyType>${EstafetaTrackingService.HISTORY_TYPE}</est:historyType>
            </est:historyConfiguration>
            <est:filterType>
            <est:filterInformation>${EstafetaTrackingService.FILTER_INFO}</est:filterInformation>
                  <est:filterType>${EstafetaTrackingService.FILTER_TYPE}</est:filterType>
            </est:filterType>
         </est:searchConfiguration>`;
        return shipmentRequestString;
    }
}
