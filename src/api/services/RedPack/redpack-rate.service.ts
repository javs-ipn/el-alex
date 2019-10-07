import * as _ from 'lodash';
import * as XMLJS from 'xml2js';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Credential } from './../../models/Credential/Credential';
import { CustomRedpackCoverageResponse } from '../../types/Redpack/custom-redpack-response.interface';
import { GenericRateObject } from '../../types/RateRequest/generic-rate-object.class';
import { RedpackBaseService } from './redpack-base.service';
import { Service } from 'typedi';
import { Courier } from '../../models/Courier/Courier';
import { ConfigOptions } from '../../types/RedPack/config-options.interface';
import { RateResponse } from '../../types/RateResponse/GenericRate/rate.response.interface';
import { CustomRedpackRateResponse } from '../../types/RateResponse/RedPack/custom-redpack-rate-response.interface';
import { RateInfo } from '../../types/RateResponse/GenericRate/rate-info.interface';

@Service()
export class RedpackRateService extends RedpackBaseService {

    public static NORMAL_DELIVERY_TYPE = 'NORMAL';
    public static OFFICE_DELIVERY_ONLY = 'OCURRE';
    public static MIN_DROPOFF = 1;
    public static SUCCESS_CODE_REDPACK = '1';
    public static WAYBILLNUMBER_ALREADY_IN_USE_REDPACK = '7';

    public static COVERAGE_HEADER_STRING =
        `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"`
        + ` xmlns:ws="http://ws.redpack.com" xmlns:xsd="http://vo.redpack.com/xsd">`
        + `<soap:Header/>`
        + `<soap:Body>`
        + `<ws:coberturaNacional>`;

    public static COVERAGE_FOOTER_STRING =
        `</ws:coberturaNacional>`
        + `</soap:Body>`
        + `</soap:Envelope>`;

    /**
     * @description - Generates the XML string needed by the national coverage redpack service
     * @param {GenericRateObject} genericRateObject - Object contaning the shipper and recipient zipcode
     * @param {DeliveryService} deliveryService - related delivery service
     * @returns {string} - XML string
     */
    public generateCoverageXMLString(genericRateObject: GenericRateObject, credential: Credential): string {
        const coverageXMLString =
            `${RedpackRateService.COVERAGE_HEADER_STRING}`
            + `${this.getConfigString(credential)}`
            + `${this.getCoverageInfoXMLString(genericRateObject)}`
            + `${RedpackRateService.COVERAGE_FOOTER_STRING}`;
        return coverageXMLString;
    }

    /**
     * @description Requests the redpack coverage soap service
     * @param {string} requestedString - XML string needed to get the coverage information
     * @param {Courier} deliveryService - Related delivery service for the requested courier
     * @returns {CustomRedpackCoverageResponse[]} - Custom coverage object withing the rates and response messages
     */
    public async requestCoverageService(requestedString: string, courier: Courier): Promise<CustomRedpackCoverageResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/soap+xml',
                'Accept': 'application/json',
            },
        };
        const coverageRequest: Array<AxiosPromise<any>> = [];
        const axiosRequest = axios.post(courier.rateRequestUrl, requestedString, axiosRequestConfig);
        coverageRequest.push(axiosRequest);

        return await Promise.all(coverageRequest)
            .then((results: Array<AxiosResponse<any>>) => {
                const options = { explicitArray: false, tagNameProcessors: [XMLJS.processors.stripPrefix], attrkey: 'rootValue' };
                const coverageResponse: any[] = [];
                results.forEach(async (axiosResponse: AxiosResponse<any>) => {
                    await XMLJS.parseString(axiosResponse.data, options, async (err, result) => {
                        coverageResponse.push(result.Envelope.Body.coberturaNacionalResponse.return);
                    });
                });
                const customCoverageObject = this.getCoverageResponse(coverageResponse);
                this.handleCoverageResponse(customCoverageObject);
                return Promise.resolve(customCoverageObject);
            }).catch((error) => {
                if (!_.has(error, 'request')) {
                    throw error.message;
                } else {
                    throw error.response.data;
                }
            });

    }

    /**
     * @description - Handles the response and matches the deliveryServiceType for coverage
     * @param {CustomRedpackCoverageResponse} coverageResponse - response with rates and messages
     * @param {CourierService} courierService - Requested service to be matched
     * @returns {RateResponse} Rate Response object with the coverage needed
     */
    public getGenericCoverageResponse(coverageResponse: CustomRedpackCoverageResponse, courier: Courier): RateResponse {
        const rateResponse: RateResponse = {
            data: {
                rates: [],
                courierName: courier.name,
            },
        };

        const auxRate: RateInfo = {
            additionalCharges: [],
            deliveryTimeHours: '',
            deliveryType: '',
            serviceDesc: '',
            serviceName: '',
            totalAmount: 0,
        };
        _.forEach(coverageResponse.rates, (rate: CustomRedpackRateResponse) => {
            auxRate.serviceDesc = rate.description;
            auxRate.serviceName = rate.serviceType.name;
            auxRate.deliveryType = rate.serviceType.deliveryType;
            auxRate.deliveryTimeHours = rate.deliveryTimeHours;
            rateResponse.data.rates.push(auxRate);
        });

        return rateResponse;
    }

    /**
     * @description - handles the parsed axios response into a customCoverage response array
     * @param {any} coverageResponse  parsed axios response
     * @returns {CustomRedpackCoverageResponse[]} - Parsed object into custom object
     */
    private getCoverageResponse(coverageResponse: any[]): CustomRedpackCoverageResponse[] {
        const coverageResponseFixed = [];
        _.forEach(coverageResponse, (coverageResponseObject: any) => {
            const customcoverageResponse: CustomRedpackCoverageResponse = {
                rates: [], messages: { messageDescription: '', resultCode: '' },
            };
            if (_.isArray(coverageResponseObject.resultadoConsumoWS)) {
                const firstResult: any = _.first(coverageResponseObject.resultadoConsumoWS);
                customcoverageResponse.messages.messageDescription = firstResult.descripcion;
                customcoverageResponse.messages.resultCode = firstResult.estatus;
            } else {
                customcoverageResponse.messages.messageDescription = coverageResponseObject.resultadoConsumoWS.descripcion;
                customcoverageResponse.messages.resultCode = coverageResponseObject.resultadoConsumoWS.estatus;
            }

            if (_.isArray(coverageResponseObject.cotizaciones)) {
                coverageResponseObject.cotizaciones.forEach((rate: any) => {
                    const foundRate = _.find(customcoverageResponse.rates, (customRate: {
                        description: string,
                        serviceType: { name: string, deliveryType: string }, deliveryTimeHours: string
                    }) => {
                        return customRate.serviceType.deliveryType === rate.tipoServicio.equivalencia
                            && customRate.serviceType.name === rate.tipoServicio.descripcion
                            && customRate.description === rate.descripcion;
                    });
                    if (!foundRate) {
                        customcoverageResponse.rates.push(
                            {
                                description: rate.descripcion,
                                serviceType: {
                                    deliveryType: rate.tipoServicio.equivalencia,
                                    name: rate.tipoServicio.descripcion,
                                },
                                deliveryTimeHours: rate.tiempoSobre,
                            });
                    }
                });
            }
            coverageResponseFixed.push(customcoverageResponse);
        });
        return coverageResponseFixed;
    }

    /**
     * @description Creates the config section  string
     * @param {Credential} credential - tenant id credential
     * @returns {string} - Rate config section string
     */
    private getConfigString(credential: Credential): string {
        const configOptions = this.getCourierOptions(credential.options);
        const credentialsString =
            `<ws:PIN>${configOptions.PIN}</ws:PIN>` +
            `<ws:idUsuario>${configOptions.idUsuario}</ws:idUsuario>`;
        return credentialsString;
    }

    /**
     * @description - Parses the courier config options into an object
     * @param {string} credentialOptions - courier config options string
     * @returns {ConfigOptions} Config options object
     */
    private getCourierOptions(credentialOptions: string): ConfigOptions {
        const configOptions: ConfigOptions = JSON.parse(credentialOptions);
        return configOptions;
    }

    /**
     * @description - Creates the XML string section for shipper and recipient zipcode
     * @param {GenericRateObject} genericRateObject - Object with the shipper and recipient info
     * @returns {string} XML string section for shipper and recipient zipcode
     */
    private getCoverageInfoXMLString(genericRateObject: GenericRateObject): string {
        const coverageInfoString =
            `<ws:guias>`
            + `<xsd:consignatario>`
            + `<xsd:codigoPostal>${genericRateObject.recipientLocation.zipcode}</xsd:codigoPostal>`
            + `</xsd:consignatario>`
            + `<xsd:remitente>`
            + `<xsd:codigoPostal>${genericRateObject.shipperLocation.zipcode}</xsd:codigoPostal>`
            + `</xsd:remitente>`
            + `</ws:guias>`;
        return coverageInfoString;
    }
}
