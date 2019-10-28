import * as _ from 'lodash';
import * as XMLJS from 'xml2js';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CustomRedpackLabelResponse } from './../../types/Redpack/custom-label-response.interface';
import { CourierServiceWaybillRangeService } from './../../types/CourierServiceRanges/courier-service-ranges.interface';
import { GenericBussinessLogicError } from './../../errors/Generic/generic-bussinessLogic.error';
import { RedpackBaseService } from './redpack-base.service';
import { Service } from 'typedi';
import { Credential } from '../../models/Credential/Credential';
import { CourierService } from '../../models/CourierService/CourierService';
import { Rate } from '../../models/Rate/rate.model';
import { RatePackageDimensions } from '../../types/RateRequest/rate-package-dimensions.class';
import { DropOff } from '../../types/enums/dropoff-enum';
import { Content } from '../../types/enums/content-enum';

@Service()
export class RedpackShipmentService extends RedpackBaseService {

    public static AUTH_BY_PIN_ID = '0';
    public static SHIPMENT_WS_START_LINE = 'ws:documentacion';
    public static DOCUMENT_PACKAGE_TYPE = 'DOCUMENTO';
    public static DOCUMENT_CONTENT_ID = '5';
    public static NON_DOCUMENT_CONTENT_ID = '1';
    public static TAG_FORMAT = 'cid:641403883265';
    public static OFFICE_DELIVERY = '1';
    public static DOMESTIC_DELIVERY = '2';
    public static LETTER_PDF = '5';
    public static SUCCESS_CODE_REDPACK = '1';
    public static WAYBILLNUMBER_ALREADY_IN_USE_REDPACK = '7';
    public static SHIPMENT_HEADER_STRING =
        `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"`
        + ` xmlns:ws="http://ws.redpack.com" xmlns:xsd="http://vo.redpack.com/xsd">`
        + `<soap:Header/>`
        + `<soap:Body>`
        + `<${RedpackShipmentService.SHIPMENT_WS_START_LINE}>`;

    public static SHIPMENT_FOOTER_STRING =
        `</${RedpackShipmentService.SHIPMENT_WS_START_LINE}>`
        + `</soap:Body>`
        + `</soap:Envelope>`;

    /**
     * @description - Gets the waybill numbers to be used for the shipment request
     * @param {DeliveryServiceWaybillRangeService} range Range info for the service selected
     * it manages the upper and lower bound along with last used waybillnumber
     * @param {number} requestedWaybills Requested waybills
     * @returns {string[]} Available waybill numbers
     */
    public getWaybillNumber(range: CourierServiceWaybillRangeService): string {
        let waybillNumber: string;
        const upperBoundToNumber = Number.parseInt(range.upperBound);
        const lastUsedNumber = Number.parseInt(range.lastUsed);
        if (lastUsedNumber + 1 <= upperBoundToNumber) {
            waybillNumber = (lastUsedNumber + 1).toString();
        } else {
            throw new GenericBussinessLogicError('Upper bound for waybill number generation is reached');
        }
        return waybillNumber;
    }

    /**
     * @description Creates the shipment xml string needed by redpack
     * @param {WaybillRequest} waybillRequest - waybill information
     * @param {string} waybillNumber Waybill number between the range given by client
     * @returns {string} xml string needed by redpack to request a shipment
     */
    public createShipmentRequestXMLString(rate: Rate, waybillNumber: string, credential: Credential): string {
        const shipmentXMLString =
            `${RedpackShipmentService.SHIPMENT_HEADER_STRING}`
            + `${this.getAuthShipmentXMLString(credential)}`
            + `${this.getWaybillInfoXMLString(rate, waybillNumber, credential)}`
            + `${RedpackShipmentService.SHIPMENT_FOOTER_STRING}`;
        return shipmentXMLString;
    }

    /**
     * @description Calls the redpack shipment request
     * @param {string[]} shipmentXMLStrings shipment strings for the  request
     * @param {DeliveryService} deliveryService Delivery service given
     * @returns {Promise<CustomRedpackLabelResponse[]>} Custom response for the requests
     */
    public async requestShipmentService(shipmentXMLString: string, credential: Credential): Promise<CustomRedpackLabelResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/soap+xml',
                'Accept': 'application/json',
            },
        };
        const shipmentRequestArray: Array<AxiosPromise<any>> = [];
        const axiosRequest = axios.post(credential.courier.shipmentRequestUrl, shipmentXMLString, axiosRequestConfig);
        shipmentRequestArray.push(axiosRequest);

        return await Promise.all(shipmentRequestArray)
            .then((results: Array<AxiosResponse<any>>) => {
                const options = { explicitArray: false, tagNameProcessors: [XMLJS.processors.stripPrefix], attrkey: 'rootValue' };
                const shipmentResponses: any[] = [];
                results.forEach(async (axiosResponse: AxiosResponse<any>) => {
                    await XMLJS.parseString(axiosResponse.data, options, async (err, result) => {
                        shipmentResponses.push(result.Envelope.Body.documentacionResponse.return);
                    });
                });
                const customResponseObject = this.getLabelResponseLabeled(shipmentResponses);
                this.handleLabelResponse(customResponseObject);
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
     * @description Gets the single range for the delivery service type given
     * @param {DeliveryServiceType} deliveryServiceType Delivery service type to search for
     * @param {DeliveryServiceWaybillRangeService[]} waybillRanges Delivery Service ranges found
     * @returns {DeliveryServiceWaybillRangeService} single delivery service range for the service given
     */
    public getWaybillRangeByServiceType(
        courierService: CourierService,
        waybillRanges: CourierServiceWaybillRangeService[]): CourierServiceWaybillRangeService {
        const rangePerService = _.find(waybillRanges, (range: CourierServiceWaybillRangeService) => {
            return range.serviceCode === courierService.serviceCode;
        });
        if (!rangePerService) {
            throw new GenericBussinessLogicError('No waybill range found service  with serviceCode = ' + courierService.serviceCode);
        }
        return rangePerService;
    }

    /**
     * @description Gets the delivery service ranges for the delivery service given
     * @param {DeliveryService} deliveryService Delivery service to search ranges for
     * @returns {CourierServiceWaybillRangeService[]} Ranges
     */
    public getDeliveryServiceWaybillRanges(courierService: CourierService): CourierServiceWaybillRangeService[] {
        const waybillRanges: CourierServiceWaybillRangeService[] = JSON.parse(courierService.waybillRangeServices);
        if (_.isEmpty(waybillRanges)) {
            throw new GenericBussinessLogicError('No waybill ranges found for delivery service with id = ' + courierService.id);
        }
        return waybillRanges;
    }

    /**
     * @description - Creates the XML auth string section
     * @param {DeliveryService} deliveryService Delivery service inherit for the request
     * @returns {string} XML auth string section
     */
    private getAuthShipmentXMLString(credential: Credential): string {
        const configOptions = JSON.parse(credential.options);
        const authString =
            `<ws:PIN>${configOptions.PIN}</ws:PIN>`
            + `<ws:idUsuario>${configOptions.idUsuario}</ws:idUsuario>`;
        return authString;
    }

    /**
     * @description - Creates the xml string for the shipper/recipient information
     * @param {WaybillRequest} waybillRequest Waybill request to gather the info
     * @param {string} waybillNumber - Waybill number gather for range delivery
     * @returns {string} xml string for the shipper/recipient information
     */
    private getWaybillInfoXMLString(rate: Rate, waybillNumber: string, credential: Credential): string {
        const configOptionsObject = JSON.parse(credential.options);
        const firstPackageDimensions: RatePackageDimensions = _.first(JSON.parse(rate.dimensionsPackages));
        let waybillInfoString = '';
        waybillInfoString =
            `<ws:guias>`
            + `<xsd:consignatario>`
            + `<xsd:calle>${rate.recipientStreetLines1}</xsd:calle>`
            + `<xsd:ciudad>${rate.cityDestination}</xsd:ciudad>`
            + `<xsd:codigoPostal>${rate.zipcodeDestination}</xsd:codigoPostal>`
            + `<xsd:colonia_Asentamiento>${rate.neighborhoodDestination}</xsd:colonia_Asentamiento>`
            + `<xsd:contacto>${rate.contactNameDestination}</xsd:contacto>`
            + `<xsd:email>${rate.emailDestination}</xsd:email>`
            + `<xsd:estado>${rate.cityDestination}</xsd:estado>`
            + `<xsd:nombre_Compania>${rate.corporateNameDestination}</xsd:nombre_Compania>`
            + `<xsd:pais>${rate.countryCodeDestination}</xsd:pais>`
            + `<xsd:referenciaUbicacion>${rate.recipientReference}</xsd:referenciaUbicacion>`
            + `<xsd:telefonos>`
            + `<xsd:telefono>${rate.phoneNumberDestination}</xsd:telefono>`
            + `</xsd:telefonos>`
            + `</xsd:consignatario>`
            + `<xsd:flag>${RedpackShipmentService.LETTER_PDF}</xsd:flag>`
            + `<xsd:moneda>${configOptionsObject.customerCurrency}</xsd:moneda>`
            + `<xsd:numeroDeGuia>${waybillNumber}</xsd:numeroDeGuia>`
            + `<xsd:observaciones>${rate.contentDescription}</xsd:observaciones>`
            + `<xsd:paquetes>`
            + `<xsd:alto>${firstPackageDimensions.height}</xsd:alto>`
            + `<xsd:ancho>${firstPackageDimensions.width}</xsd:ancho>`
            + `<xsd:consecutivo>0</xsd:consecutivo>`
            + `<xsd:descripcion>${rate.contentDescription}</xsd:descripcion>`
            + `<xsd:formatoEtiqueta>${RedpackShipmentService.TAG_FORMAT}</xsd:formatoEtiqueta>`
            + `<xsd:largo>${firstPackageDimensions.length}</xsd:largo>`
            + `<xsd:peso>${firstPackageDimensions.weight}</xsd:peso>`
            + `</xsd:paquetes>`
            + `<xsd:referencia>${rate.shipperReference}</xsd:referencia>`
            + `<xsd:remitente>`
            + `<xsd:calle>${rate.shipperStreetLines1}</xsd:calle>`
            + `<xsd:ciudad>${rate.cityOrigin}</xsd:ciudad>`
            + `<xsd:codigoPostal>${rate.zipcodeOrigin}</xsd:codigoPostal>`
            + `<xsd:colonia_Asentamiento>${rate.neighborhoodOrigin}</xsd:colonia_Asentamiento>`
            + `<xsd:contacto>${rate.contactNameOrigin}</xsd:contacto>`
            + `<xsd:email>${rate.emailOrigin}</xsd:email>`
            + `<xsd:estado>${rate.cityOrigin}</xsd:estado>`
            + `<xsd:nombre_Compania>${rate.corporateNameOrigin}</xsd:nombre_Compania>`
            + `<xsd:pais>${rate.countryCodeOrigin}</xsd:pais>`
            + `<xsd:referenciaUbicacion>${rate.shipperReference}</xsd:referenciaUbicacion>`
            + `<xsd:telefonos>`
            + `<xsd:telefono>${rate.phoneNumberOrigin}</xsd:telefono>`
            + `</xsd:telefonos>`
            + `</xsd:remitente>`
            + `<xsd:tipoEntrega>`
            + `<xsd:id>${this.getDeliveryType(rate.deliveryType)}</xsd:id>`
            + `</xsd:tipoEntrega>`
            + `<xsd:tipoEnvio>`
            + `<xsd:id>${this.getContentType(rate.packageType)}</xsd:id>`
            + `</xsd:tipoEnvio>`
            + `<xsd:tipoIdentificacion>`
            + `<xsd:id>${RedpackShipmentService.AUTH_BY_PIN_ID}</xsd:id>`
            + `</xsd:tipoIdentificacion>`
            + `<xsd:tipoServicio>`
            + `<xsd:id>${rate.serviceId}</xsd:id>`
            + `</xsd:tipoServicio>`
            + this.shipmentInsuredXMLString(rate)
            + `</ws:guias>`;
        return waybillInfoString;
    }

    /**
     * @description - Gets the content Type needed by redpack
     * @param {string} packageType Detail to get the package info
     * @returns {string} Redpack document or package type id
     */
    private getContentType(packageType: string): string {
        let contentType = RedpackShipmentService.DOCUMENT_CONTENT_ID;
        if (packageType === Content.NON_DOCUMENTS) {
            contentType = RedpackShipmentService.NON_DOCUMENT_CONTENT_ID;
        }
        return contentType;
    }

    /**
     * @description Creates an array of custom shipment response to handle easily from estafeta XML response
     * @param {any[]} shipmentResponse Response array in JSON format from XML
     * @returns {CustomRedpackLabelResponse[]} Custom label response
     */
    private getLabelResponseLabeled(shipmentResponse: any[]): CustomRedpackLabelResponse[] {
        const customLabelResponse: CustomRedpackLabelResponse[] = [];
        _.forEach(shipmentResponse, (labelResponseObject: any) => {
            const customResponse: CustomRedpackLabelResponse = {
                messages: { messageDescription: '', resultCode: '' },
                label: { pdfString: '' }, waybillNumber: '',
            };
            if (_.isArray(labelResponseObject.resultadoConsumoWS)) {
                const firstResult: any = _.first(labelResponseObject.resultadoConsumoWS);
                customResponse.messages.messageDescription = firstResult.descripcion;
                customResponse.messages.resultCode = firstResult.estatus;
            } else {
                customResponse.messages.messageDescription = labelResponseObject.resultadoConsumoWS.descripcion;
                customResponse.messages.resultCode = labelResponseObject.resultadoConsumoWS.estatus;
            }
            customResponse.label.pdfString = labelResponseObject.paquetes.formatoEtiqueta;
            customResponse.waybillNumber = labelResponseObject.numeroDeGuia;
            customLabelResponse.push(customResponse);
        });
        return customLabelResponse;
    }

    /**
     * @description - Gets the delivery type for the shipment
     * @param {string} deliveryType Waybill detail
     * @returns {string}  delivery type
     */
    private getDeliveryType(deliveryType: string): string {
        let deliveryTypeRedPack = RedpackShipmentService.DOMESTIC_DELIVERY;
        if (deliveryType === DropOff.REQUEST_COURIER) {
            deliveryTypeRedPack = RedpackShipmentService.OFFICE_DELIVERY;
        }
        return deliveryTypeRedPack;
    }
}
