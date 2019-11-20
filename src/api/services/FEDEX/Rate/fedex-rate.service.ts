import * as _ from 'lodash';
import * as moment from 'moment';
import * as XMLJS from 'xml2js';
import axios, { AxiosRequestConfig } from 'axios';
import { ClientDetail } from '../../../types/Credential/Fedex/ClientDetail/client-detail.interface';
import { FedexCredential } from '../../../types/Credential/Fedex/FedexCredential/fedex-credential.inteface';
import { FedexNotificationResponse } from '../../../types/FEDEX/Response/Notification/fedex-notification-response.interface';
import { FedexRateResponse } from '../../../types/FEDEX/Rate/FedexRateResponse/fedex-rate-response.interface';
import { GenericBussinessLogicError } from '../../../errors/Generic/generic-bussinessLogic.error';
import { GenericRateObject } from '../../../types/RateRequest/generic-rate-object.class';
import { HandlerErrorFedex } from '../../../errors/Fedex/handler-error-fedex.error.class';
import { Logger, LoggerInterface } from '../../../../decorators/Logger';
import { RatePackage } from '../../../types/RateRequest/rate-package.class';
import { RateReplyDetail } from '../../../types/FEDEX/Rate/RateReplyDetail/rate-reply-detail.interface';
import { RequestedPackageLineItem } from '../../../types/FEDEX/Request/RequestedPackageLineItem/requested-package-line-item.interface';
import { RequestedShipment } from '../../../types/FEDEX/Request/RequestedShipment/requested-shipment.class';
import { RequestedShipmentOptions } from '../../../types/FEDEX/Request/RequestedShipment/requested-shipment-options.interface';
import { Service } from 'typedi';
import { ShipmentData } from '../../../types/FEDEX/Shipment/ShipmentData/shipment-data.class';
import { SOAPServiceVersion } from '../../../types/Credential/Fedex/SoapServiceVersion/soap-service-version.interface';
import { TotalInsured } from '../../../types/FEDEX/Request/TotalInsured/total-insured.interfaces';
import { WebAuthenticationDetail } from '../../../types/Credential/Fedex/WebAuthenticationDetail/web-authentication-detail.interface';
import { FedexBaseService } from '../BASE/fedex-base';

@Service()
export class FedexRateService extends FedexBaseService {

    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) {
        super();
    }

    /**
     * @description Request of rate to the SOAP FEDEX service.
     * @param {DeliveryServiceType} deliveryServiceType Selected service type for shipment.
     * @param {GenericRateObject} genericRateObject Request generic for rate request.
     * @returns {RateReplyDetail[]} Returns Rates availables for shipment.
     */
    public async requestRateAvailableServices(
        xmlData: string, rateUrl: string, soapAction: string): Promise<RateReplyDetail[]> {
        this.log.debug('getting rate for available service...');
        try {
            const axiosRequestConfig: AxiosRequestConfig = this.getHeadersRequestAxiosSOAP(soapAction);
            const responseRate = await axios.post(rateUrl, xmlData, axiosRequestConfig);
            if (responseRate.status !== 200) {
                throw new GenericBussinessLogicError(responseRate.statusText);
            }
            let rateReply: FedexRateResponse;
            const responseData = this.cleanResponse(responseRate.data, this.XML_NAME_SPACE_RATE);
            const options = { explicitArray: false, tagNameProcessors: [XMLJS.processors.stripPrefix] };
            await XMLJS.parseString(responseData, options, async (err: string, result: { Envelope: { Body: { RateReply: FedexRateResponse; }; }; }) => {
                if (err) {
                    throw new GenericBussinessLogicError(err);
                }
                rateReply = result.Envelope.Body.RateReply;
            });
            this.handleRateResponse(rateReply);
            let rateReplyDetails: RateReplyDetail[];
            if (rateReply.RateReplyDetails) {
                if (_.isArray(rateReply.RateReplyDetails)) {
                    rateReplyDetails = rateReply.RateReplyDetails;
                } else {
                    rateReplyDetails = [];
                    rateReplyDetails.push(rateReply.RateReplyDetails);
                }
            } else {
                rateReplyDetails = [];
            }
            return rateReplyDetails;
        } catch (error) {
            throw new GenericBussinessLogicError(error.message, [error]);
        }
    }

    /**
     * @description Creates a xml envelope body to request SOAP service.
     * @param {FedexCredential} fedexCredential - Authentication data necessary to connnect SOAP service.
     * @param {GenericRateObject} genericRateObject - Request data to shipment.
     * @returns {string} Returns SOAP xml envelope.
     */
    public generateAvailableServicesRateXML(
        fedexCredential: FedexCredential, genericRateObject: GenericRateObject): string {
        const webAuthenticationDetail: WebAuthenticationDetail = fedexCredential.webAuthenticationDetail;
        const clientDetail: ClientDetail = fedexCredential.clientDetail;
        const versionService: SOAPServiceVersion = fedexCredential.soapAction.version;
        const accountNumber: string = fedexCredential.clientDetail.accountNumber;
        const requestAvailableServicesRate = `${this.ENVELOPE_SOAP_HEADER}`
            + `<RateRequest>`
            + `${this.getWebAuthenticationDetailXML(webAuthenticationDetail)}`
            + `${this.getClientDetailXML(clientDetail)}`
            + `${this.getTransactionDetailXML(this.RATE_ACTION)}`
            + `${this.getVersionXML(versionService)}`
            + `${this.getRequestedShipmentXML(this.getRateRequestedShipment(genericRateObject, accountNumber))}`
            + `</RateRequest>`
            + `${this.ENVELOPE_SOAP_FOOTER}`;
        return requestAvailableServicesRate;
    }
    /**
     * @description Inspect if response contains errors and throws exception if found it.
     * @param {FedexRateResponse} fedexRateResponse The response request data.
     * @returns {void}
     */
    private handleRateResponse(fedexRateResponse: FedexRateResponse): void {
        if (fedexRateResponse.HighestSeverity.toUpperCase() === this.ERROR
            || fedexRateResponse.HighestSeverity.toUpperCase() === this.FAILURE_MESSAGE) {
            const notification: FedexNotificationResponse = this.getFedexNotification(fedexRateResponse.Notifications);
            HandlerErrorFedex.handlerRequestError(notification);
        }
    }
    /**
     * @description Gets RequestedShipment data for rate request.
     * @param {GenericRateObject} genericRateObject Contains data necessary for rate request.
     * @param {string} accountNumber The account number for FEDEX service.
     * @returns {RequestedShipment} Returns RequestedShipment object.
     */
    private getRateRequestedShipment(genericRateObject: GenericRateObject, accountNumber: string): RequestedShipment {
        const firstPackage: RatePackage = _.first(genericRateObject.packages);
        const shipperLocation: ShipmentData = new ShipmentData();
        shipperLocation.city = genericRateObject.shipperLocation.cityName;
        shipperLocation.countryCode = genericRateObject.shipperLocation.countryISOCode;
        shipperLocation.zipcode = genericRateObject.shipperLocation.zipcode;
        const recipientLocation: ShipmentData = new ShipmentData();
        recipientLocation.city = genericRateObject.recipientLocation.cityName;
        recipientLocation.countryCode = genericRateObject.recipientLocation.countryISOCode;
        recipientLocation.zipcode = genericRateObject.recipientLocation.zipcode;
        let packageType: string = firstPackage.shipmentRateDetail.contentType;
        if (packageType === this.DOCUMENTS_TYPE_FRONT_END) {
            packageType = this.DOCUMENTS_TYPE;
        }
        const requestedPackageLineItem: RequestedPackageLineItem = {
            description: firstPackage.description,
            packageType,
            referenceRecipient: this.EMPTY_STRING,
            dimensionsInfo: {
                height: firstPackage.packageInfo.height,
                length: firstPackage.packageInfo.length,
                weight: firstPackage.packageInfo.weight,
                width: firstPackage.packageInfo.width,
            },
        };
        const insured: TotalInsured = {
            isInsured: false,
        };
        const requestShipmentOptions: RequestedShipmentOptions = {
            accountNumber,
            dropoffType: this.DROPOFF_TYPE,
            insured,
            isShipmentRequest: false,
            packageType,
            recipientLocation,
            requestedPackageLineItems: [requestedPackageLineItem],
            serviceType: this.EMPTY_STRING,
            shipperLocation,
            totalWeight: firstPackage.packageInfo.weight,
        };
        return new RequestedShipment(requestShipmentOptions);
    }
    /**
     * @description Gets RequestedShipment xml object.
     * @param {string} accountNumber Account number to be use.
     * @param {GenericRateObject} genericRateObject Data rate
     * @returns {string} Return RequestedShipment xml.
     */
    private getRequestedShipmentXML(requestedShipment: RequestedShipment): string {
        const requestedShipmentXML = `<RequestedShipment>`
            + `<ShipTimestamp>${moment().format(this.DATE_FORMAT)}</ShipTimestamp>`
            + `<TotalWeight>`
            + `<Units>${this.WEIGHT_UNITS}</Units>`
            + `<Value>${requestedShipment.totalWeight}</Value>`
            + `</TotalWeight>`
            + `${this.getTotalInsuredXML(requestedShipment.insured, requestedShipment.packageType)}`
            + `${this.getShipperXML(requestedShipment.shipperLocation, requestedShipment.isShipmentRequest)}`
            + `${this.getRecipientXML(requestedShipment.recipientLocation, requestedShipment.isShipmentRequest)}`
            + `${this.getShippingChargesPaymentXML(requestedShipment.accountNumber, requestedShipment.isShipmentRequest)}`
            + `<PackageCount>${this.COUNT_LABELS}</PackageCount>`
            + `${this.getRequestedPackageLineItemsXML(requestedShipment.requestedPackageLineItems)}`
            + `</RequestedShipment>`;
        return requestedShipmentXML;
    }
}
