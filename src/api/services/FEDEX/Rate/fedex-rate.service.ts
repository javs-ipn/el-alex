import * as _ from 'lodash';
import * as moment from 'moment';
import * as uuid from 'uuid';
import * as XMLJS from 'xml2js';
import axios, { AxiosRequestConfig } from 'axios';
import { AdditionalCharges } from '../../../types/RateResponse/AdditionalCharges/additional-charges.interface';
import { ClientDetail } from '../../../types/Credential/Fedex/ClientDetail/client-detail.interface';
import { Courier } from '../../../types/enums/courier-enum';
import { CourierRate } from '../../../types/RateResponse/courier-rate.interface';
import { CourierService } from '../../../models/CourierService/CourierService';
import { DropOff } from '../../../types/enums/dropoff-enum';
import { FedexBaseService } from '../Base/fedex-base.service';
import { FedexCredential } from '../../../types/Credential/Fedex/FedexCredential/fedex-credential.inteface';
import { FedexNotificationResponse } from '../../../types/FEDEX/Response/Notification/fedex-notification-response.interface';
import { FedexRateResponse } from '../../../types/FEDEX/Rate/FedexRateResponse/fedex-rate-response.interface';
import { GenericBussinessLogicError } from '../../../errors/Generic/generic-bussinessLogic.error';
import { GenericRateObject } from '../../../types/RateRequest/generic-rate-object.class';
import { GenericRateResponse } from '../../../types/RateResponse/generic-rate-response.interface';
import { HandlerErrorFedex } from '../../../errors/Fedex/handler-error-fedex.error.class';
import { HttpStatusCodes } from '../../../types/enums/http-status-codes.enum';
import { Logger, LoggerInterface } from '../../../../decorators/Logger';
import { Names } from '../../../types/FEDEX/Rate/ServiceDescription/names.interface';
import { Rate } from '../../../models/Rate/rate.model';
import { RatedShipmentDetails } from '../../../types/FEDEX/Rate/RateReplyDetail/rated-shipment-details.interface';
import { RatePackage } from '../../../types/RateRequest/rate-package.class';
import { RatePackageDimensions } from '../../../types/RateRequest/rate-package-dimensions.class';
import { RateReplyDetail } from '../../../types/FEDEX/Rate/RateReplyDetail/rate-reply-detail.interface';
import { RateService } from '../../Rate/rate.service';
import { RequestedPackageLineItem } from '../../../types/FEDEX/Request/RequestedPackageLineItem/requested-package-line-item.interface';
import { RequestedShipment } from '../../../types/FEDEX/Request/RequestedShipment/requested-shipment.class';
import { RequestedShipmentOptions } from '../../../types/FEDEX/Request/RequestedShipment/requested-shipment-options.interface';
import { Service } from 'typedi';
import { ShipmentData } from '../../../types/FEDEX/Shipment/ShipmentData/shipment-data.class';
import { SOAPServiceVersion } from '../../../types/Credential/Fedex/SoapServiceVersion/soap-service-version.interface';
import { Surcharges } from '../../../types/FEDEX/Rate/RateReplyDetail/surcharges.interface';
import { Taxes } from '../../../types/FEDEX/Response/Shipment/ShipmentRating/taxes.interface';
import { TotalInsured } from '../../../types/FEDEX/Request/TotalInsured/total-insured.interfaces';
import { WebAuthenticationDetail } from '../../../types/Credential/Fedex/WebAuthenticationDetail/web-authentication-detail.interface';

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
    public async rateAvailableServicesRequest(
        xmlData: string, rateUrl: string, soapAction: string): Promise<RateReplyDetail[]> {
        this.log.debug('Getting Fedex rate for available services...');
        try {

            const axiosRequestConfig: AxiosRequestConfig = this.getHeadersRequestAxiosSOAP(soapAction);
            const responseRate = await axios.post(rateUrl, xmlData, axiosRequestConfig);
            if (responseRate.status !== HttpStatusCodes.SUCCESS) {
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
        const versionService: SOAPServiceVersion = fedexCredential.version;
        const accountNumber: string = fedexCredential.clientDetail.accountNumber;
        const requestAvailableServicesRate = `${this.ENVELOPE_SOAP_HEADER_RATE}`
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
     * @description Gets RateResponse object to FEDEX rate request.
     * @param {Rate[]} availableRates Available rates for shipment.
     * @returns {GenericRateResponse} Returns generic rate response with FEDEX rates.
     */
    public getGenericRateResponse(availableRates: Rate[]): GenericRateResponse {
        const genericRateResponse: GenericRateResponse = {
            rates: [],
        };
        const fedexCourierRate: CourierRate = {
            name: Courier.FEDEX,
            services: [],
        };
        _.forEach(availableRates, (rate: Rate) => {
            const charges: AdditionalCharges = this.getAdditionalChargeObject(rate.additionalCharges);
            fedexCourierRate.services.push({
                rateId: rate.id,
                serviceName: charges.serviceName,
                currency: rate.countryCodeOrigin,
                amount: rate.totalPrice,
                estimatedDeliveryDate: new Date().toDateString(),
                chargesDetail: charges.chargesDetail,
            });
        });
        genericRateResponse.rates.push(fedexCourierRate);
        return genericRateResponse;
    }
    /**
     * @description Generates the rate object to will be save in the database.
     * @param {RateReplyDetail[]} availableFedexServices The available services from FEDEX.
     * @param {GenericRateObject} genericRateObject The data to do rate.
     * @param {CourierService[]} courierServices The services in the system.
     */
    public generateRateObjects(availableFedexServices: RateReplyDetail[], genericRateObject: GenericRateObject, courierServices: CourierService[]): Rate[] {
        const INTERNAL_ID = uuid();
        let rates: Rate[];
        let totalDimensions: RatePackageDimensions;
        let serviceName: string;
        if (!_.isEmpty(availableFedexServices)) {
            const ratedPackage = _.first(genericRateObject.packages);
            totalDimensions = this.getTotalDimensionsOfAllPackages(genericRateObject.packages);
            rates = [];
            _.forEach(availableFedexServices, (rateReply: RateReplyDetail) => {
                serviceName = this.getFedexServiceName(rateReply.ServiceDescription.Names);
                const ratedShipmentDetails = this.getRatedShipmentDetails(rateReply);
                const rateToSave: Rate = new Rate();
                rateToSave.additionalCharges = this.getAdditionalChargesInJsonObject(ratedShipmentDetails, serviceName);
                rateToSave.cityDestination = genericRateObject.recipientLocation.cityName;
                rateToSave.cityOrigin = genericRateObject.shipperLocation.cityName;
                rateToSave.contentDescription = ratedPackage.description;
                rateToSave.countryCodeDestination = genericRateObject.recipientLocation.countryISOCode;
                rateToSave.countryCodeOrigin = genericRateObject.shipperLocation.countryISOCode;
                rateToSave.deliveryType = ratedPackage.shipmentRateDetail.dropOffType;
                rateToSave.dimensionsPackages = this.getDimensionsJsonObjectOfAllPackages(genericRateObject.packages);
                rateToSave.extendedZoneShipment = this.isExtendedService(ratedShipmentDetails.ShipmentRateDetail.Surcharges);
                rateToSave.internalId = INTERNAL_ID;
                rateToSave.multipleShipment = RateService.isMultipleShipment(genericRateObject.packages);
                rateToSave.packageType = ratedPackage.shipmentRateDetail.contentType;
                rateToSave.rated = true;
                rateToSave.serviceId = this.findFedexServiceId(courierServices, rateReply.ServiceType);
                rateToSave.status = false;
                rateToSave.subTotalPrice = ratedShipmentDetails.ShipmentRateDetail.TotalNetFreight.Amount;
                rateToSave.tenantId = genericRateObject.tenantId;
                rateToSave.totalHeight = totalDimensions.height;
                rateToSave.totalLength = totalDimensions.length;
                rateToSave.totalPrice = ratedShipmentDetails.ShipmentRateDetail.TotalNetChargeWithDutiesAndTaxes.Amount;
                rateToSave.totalWeight = totalDimensions.weight;
                rateToSave.totalWidth = totalDimensions.width;
                rateToSave.zipcodeDestination = genericRateObject.recipientLocation.zipcode;
                rateToSave.zipcodeOrigin = genericRateObject.shipperLocation.zipcode;
                rateToSave.insurance = false;
                if (rateToSave.deliveryType === DropOff.REQUEST_COURIER) {
                    rateToSave.pickupDate = new Date();
                }
                if (rateToSave.insurance) {
                    rateToSave.customsValue = ratedPackage.customsValue;
                } else {
                    rateToSave.customsValue = this.ZERO_VALUE;
                }
                rates.push(rateToSave);
            });
        } else {
            rates = [];
        }
        return rates;
    }
    /**
     * @description Select rates responses that have in the system.
     * @param {CourierService[]} servicesForCourier
     * @param {RateReplyDetail[]} availableFedexServices
     * @returns {RateReplyDetail[]} Returns the selected services.
     */
    public filterExistingDatabaseFedexServices(servicesForCourier: CourierService[], availableFedexServices: RateReplyDetail[]): RateReplyDetail[] {
        const filterServices: RateReplyDetail[] = [];
        _.forEach(availableFedexServices, (rateAvailable: RateReplyDetail) => {
            const foundService = _.find(servicesForCourier, (courierService: CourierService) => {
                return courierService.serviceCode === rateAvailable.ServiceType;
            });
            if (foundService) {
                filterServices.push(rateAvailable);
            }
        });
        return filterServices;
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
    /**
     * @description Verifies if contains extended service surcharge.
     * @param {Surcharges} surcharges
     * @returns {boolean} Returns true if contains extended service surcharge.
     */
    private isExtendedService(surcharges: Surcharges[]): boolean {
        let isExtendedService: boolean;
        if (_.isArray(surcharges)) {
            const extendedServiceFound = _.find(surcharges, (surcharge: Surcharges) => {
                return surcharge.SurchargeType === this.EXTENDED_SERVICE;
            });
            if (extendedServiceFound) {
                isExtendedService = true;
            } else {
                isExtendedService = false;
            }
        } else {
            const surchargeReceived: Surcharges = surcharges;
            if (surchargeReceived.SurchargeType === this.EXTENDED_SERVICE) {
                isExtendedService = true;
            } else {
                isExtendedService = false;
            }
        }
        return isExtendedService;
    }
    /**
     * @description Gets total quantities for dimension in the shipment.
     * @param {RatePackage[]} ratePackages
     * @returns {RatePackageDimensions} Returns total dimensions quantities.
     */
    private getTotalDimensionsOfAllPackages(ratePackages: RatePackage[]): RatePackageDimensions {
        const totalValues: RatePackageDimensions = {
            height: 0,
            length: 0,
            weight: 0,
            width: 0,
        };
        _.forEach(ratePackages, (packageDimensions: RatePackage) => {
            totalValues.length += packageDimensions.packageInfo.length;
            totalValues.width += packageDimensions.packageInfo.width;
            totalValues.weight += packageDimensions.packageInfo.weight;
            totalValues.height += packageDimensions.packageInfo.height;
        });
        return totalValues;
    }
    /**
     * @description Gets JSON Object for all rate packages.
     * @param {RatePackage} ratePackages
     * @returns {string} JSON string object.
     */
    private getDimensionsJsonObjectOfAllPackages(ratePackages: RatePackage[]): string {
        const packageDimensions: RatePackageDimensions[] = [];
        _.forEach(ratePackages, (ratedDimensionsPackage) => {
            packageDimensions.push(ratedDimensionsPackage.packageInfo);
        });
        return JSON.stringify(packageDimensions);
    }
    /**
     * @description Validate if contains an array gets a first element otherwise gets object.
     * @param {RateReplyDetail} rateReply The rate response for Fedex.
     * @returns {RatedShipmentDetails} Returns a valid object for RatedShipmentDetails.
     */
    private getRatedShipmentDetails(rateReply: RateReplyDetail): RatedShipmentDetails {
        let ratedShipmentDetails: RatedShipmentDetails;
        if (_.isArray(rateReply.RatedShipmentDetails)) {
            ratedShipmentDetails = _.first(rateReply.RatedShipmentDetails);
        } else {
            ratedShipmentDetails = rateReply.RatedShipmentDetails;
        }
        return ratedShipmentDetails;
    }
    /**
     * @description Gets an json object string with additional charges.
     * @param {RatedShipmentDetails} ratedShipmentDetails The rate respose.
     * @param {string} serviceName The name of the service that rate.
     * @returns {string} Returns the string for additional charges.
     */
    private getAdditionalChargesInJsonObject(ratedShipmentDetails: RatedShipmentDetails, serviceName: string): string {
        const additionalCharges: AdditionalCharges = {
            serviceName,
            chargesDetail: [],
        };
        const surcharges = ratedShipmentDetails.ShipmentRateDetail.Surcharges;
        const taxes = ratedShipmentDetails.ShipmentRateDetail.Taxes;
        if (_.isArray(surcharges)) {
            _.forEach(surcharges, (surchargeForShipment: Surcharges) => {
                additionalCharges.chargesDetail.push({ concept: surchargeForShipment.Description, amount: surchargeForShipment.Amount.Amount });
            });
        } else {
            const surchage: Surcharges = surcharges;
            additionalCharges.chargesDetail.push({ concept: surchage.Description, amount: surchage.Amount.Amount });
        }
        if (_.isArray(taxes)) {
            _.forEach(taxes, (taxForShipment: Taxes) => {
                additionalCharges.chargesDetail.push({ concept: taxForShipment.Description, amount: taxForShipment.Amount.Amount });
            });
        } else {
            const taxForShipment: Taxes = taxes;
            additionalCharges.chargesDetail.push({ concept: taxForShipment.Description, amount: taxForShipment.Amount.Amount });
        }
        return JSON.stringify(additionalCharges);
    }
    /**
     * @description Finds a service id that correspont that rate response.
     * @param {CourierService[]} servicesForCourier All services for Fedex.
     * @param {string} serviceCode Service code in rate response.
     */
    private findFedexServiceId(servicesForCourier: CourierService[], serviceCode: string): number {
        const serviceFound = _.find(servicesForCourier, (courierService: CourierService) => {
            return courierService.serviceCode === serviceCode;
        });
        return serviceFound.id;
    }
    /**
     * @description Gets a service name string from fedex response.
     * @param {Names[]} names The names available.
     * @returns {string} Returns a service name filter by type and encoding.
     */
    private getFedexServiceName(names: Names[]): string {
        const selectedName = _.find(names, (name: Names) => {
            return name.Type.toUpperCase() === this.SERVICE_DESCRIPTION_TYPE
                && name.Encoding.toUpperCase() === this.SERVICE_DESCRIPTION_ENCODING;
        });
        return selectedName.Value;
    }
    /**
     * @description Gets an object js from string json.
     * @param {string} additionalChargesString String addtional charges.
     * @returns {AdditionalCharges} Returns the object of AdditionalCharges.
     */
    private getAdditionalChargeObject(additionalChargesString: string): AdditionalCharges {
        return JSON.parse(additionalChargesString);
    }
}
