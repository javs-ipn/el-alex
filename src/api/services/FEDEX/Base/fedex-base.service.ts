import * as _ from 'lodash';
import * as uuid from 'uuid';
import { AxiosRequestConfig } from 'axios';
import { ClientDetail } from '../../../types/Credential/Fedex/ClientDetail/client-detail.interface';
import { ContactInfo } from '../../../types/FEDEX/Request/ContactInfo/contact-class.interface';
import { Credential } from '../../../models/Credential/Credential';
import { DimensionsInfo } from '../../../types/Credential/Fedex/DimensionsInfo/dimensions-info.class';
import { FedexCredential } from '../../../types/Credential/Fedex/FedexCredential/fedex-credential.inteface';
import { FedexCredentialOptions } from '../../../types/Credential/Fedex/FedexCredentialOptions/fedex-credential-options.interface';
import { FedexNotificationResponse } from '../../../types/FEDEX/Response/Notification/fedex-notification-response.interface';
import { GenericBussinessLogicError } from '../../../errors/Generic/generic-bussinessLogic.error';
import { RequestedPackageLineItem } from '../../../types/FEDEX/Request/RequestedPackageLineItem/requested-package-line-item.interface';
import { ShipmentData } from '../../../types/FEDEX/Shipment/ShipmentData/shipment-data.class';
import { SOAPServiceVersion } from '../../../types/Credential/Fedex/SoapServiceVersion/soap-service-version.interface';
import { TotalInsured } from '../../../types/FEDEX/Request/TotalInsured/total-insured.interfaces';
import { UserCredential } from '../../../types/Credential/Fedex/UserCredential/user-credential.interface';
import { WebAuthenticationDetail } from '../../../types/Credential/Fedex/WebAuthenticationDetail/web-authentication-detail.interface';

export class FedexBaseService {

    protected readonly TOTAL_TRACKING = 1;
    protected readonly ACCOUNT_PAYMENT_TYPE = 'ACCOUNT';
    protected readonly COUNT_LABELS = 1;
    protected readonly CURRENCY_MXN = 'MXN';
    protected readonly CURRENCY_MXN_FEDEX = 'NMP';
    protected readonly CURRENCY_USD = 'USD';
    protected readonly CUSTOMER_REFERENCE_TYPE = 'CUSTOMER_REFERENCE';
    protected readonly DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ssZ';
    protected readonly DELIVERED_STATUS = 'DL';
    protected readonly DIMENSIONS_UNITS = 'CM';
    protected readonly DOCUMENTS_TYPE = 'DOCUMENTO';
    protected readonly DOCUMENTS_TYPE_FRONT_END = 'DOCUMENTS';
    protected readonly DROPOFF_TYPE = 'REGULAR_PICKUP';
    protected readonly EMPTY_STRING = '';
    protected readonly ERROR = 'ERROR';
    protected readonly EXTENDED_SERVICE = 'OUT_OF_DELIVERY_AREA';
    protected readonly FAILURE_MESSAGE = 'FAILURE';
    protected readonly FEDEX_DB_ID = 4;
    protected readonly FEDEX_EXPRESS_SAVER = 'FEDEX_EXPRESS_SAVER';
    protected readonly IMAGE_TYPE = 'PDF';
    protected readonly INCLUDE_DETAILED_SCANS = 'INCLUDE_DETAILED_SCANS';
    protected readonly INITAL_SEQUENCE_NUMBER = 1;
    protected readonly LABEL_FORMAT_TYPE = 'COMMON2D';
    protected readonly LABEL_STOCK_TYPE = 'PAPER_8.5X11_TOP_HALF_LABEL';
    protected readonly MINIMUM_AMOUNT = 1;
    protected readonly MINIMUM_ARRAY_SIZE = 1;
    protected readonly MULTIPLE_PACKAGES_VALUE = 2;
    protected readonly PACKAGING_TYPE_CUSTOM = 'YOUR_PACKAGING';
    protected readonly PACKAGING_TYPE_ENVELOPE = 'FEDEX_ENVELOPE';
    protected readonly PICKED_UP_STATUS = 'PU';
    protected readonly RATE_ACTION = 'RATE';
    protected readonly RATE_REQUEST_TYPES = 'LIST';
    protected readonly SENDER_PAYMENT_TYPE = 'SENDER';
    protected readonly SERVICE_DESCRIPTION_ENCODING = 'UTF-8';
    protected readonly SERVICE_DESCRIPTION_TYPE = 'MEDIUM';
    protected readonly SHIPMENT_ACTION = 'SHIPMENT';
    protected readonly SUCCESS = 'SUCCESS';
    protected readonly TENANT_ID = 54321;
    protected readonly TRACKING_TYPE = 'TRACKING_NUMBER_OR_DOORTAG';
    protected readonly WARNING = 'WARNING';
    protected readonly WEIGHT_DOCUMENT_MAXIMUM_VALUE = 0.5;
    protected readonly WEIGHT_UNITS = 'KG';
    protected readonly XML_NAME_SPACE_TRACK = 'xmlns:v18="http://fedex.com/ws/track/v18"';
    protected readonly XML_NAME_SPACE_RATE = 'xmlns:v26="http://fedex.com/ws/rate/v26"';
    protected readonly XML_NAME_SPACE_SHIP = 'xmlns:v25="http://fedex.com/ws/ship/v25"';
    protected readonly ZERO_VALUE = 0;
    protected readonly ENVELOPE_SOAP_HEADER_RATE = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" `
        + `xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" `
        + `xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" `
        + `xmlns:xsd="http://www.w3.org/2001/XMLSchema" `
        + `xmlns="http://fedex.com/ws/rate/v26">`
        + `<SOAP-ENV:Body> `;
    protected readonly ENVELOPE_SOAP_HEADER_SHIP = '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" '
        + 'xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
        + 'xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://fedex.com/ws/ship/v25">'
        + '<SOAP-ENV:Body>';
    protected readonly ENVELOPE_SOAP_HEADER_TRACK = '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" '
        + 'xmlns="http://fedex.com/ws/track/v18">'
        + ' <SOAP-ENV:Body>';
    protected readonly ENVELOPE_SOAP_FOOTER = '</SOAP-ENV:Body> '
        + '</SOAP-ENV:Envelope>';
    protected readonly HEADER_REQUEST_ACCEPT = 'application/json';
    protected readonly HEADER_REQUEST_CONTENT_TYPE = 'application/xml';

    /**
     * @description Gets FEDEX credential instance.
     * @returns {FedexCredential} Returns a unique object.
     */
    public getFedexCredential(credentialDataByType: Credential): FedexCredential {
        return this.createFedexCredentialObject(credentialDataByType);
    }
    /**
     * @description create axios headers with specific soap action.
     * @param {string} soapAction
     * @returns {AxiosRequestConfig}
     */
    protected getHeadersRequestAxiosSOAP(soapAction: string): AxiosRequestConfig {
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': this.HEADER_REQUEST_CONTENT_TYPE,
                'Accept': this.HEADER_REQUEST_ACCEPT,
                'SOAPAction': soapAction,
            },
        };
        return axiosRequestConfig;
    }
    /**
     * @description Parse string to object js.
     * @param {string} deliveryOptions Options for service request.
     * @returns {FedexConfigOptions} Returns object parsed
     */
    protected getFedexConfigOptionsObject(deliveryOptions: string): FedexCredentialOptions {
        const fedexConfigOptions: FedexCredentialOptions = JSON.parse(deliveryOptions);
        return fedexConfigOptions;
    }
    /**
     * @description
     * @param webAuthenticationDetail
     * @returns
     */
    protected getWebAuthenticationDetailXML(webAuthenticationDetail: WebAuthenticationDetail): string {
        const userCredential: UserCredential = webAuthenticationDetail.userCredential;
        const webAuthenticationDetailXML = `<WebAuthenticationDetail>`
            + ` <UserCredential>`
            + ` <Key>${userCredential.key}</Key>`
            + ` <Password>${userCredential.password}</Password>`
            + ` </UserCredential>`
            + ` </WebAuthenticationDetail>`;
        return webAuthenticationDetailXML;
    }
    /**
     * @description Gets ClientDetail xml object.
     * @param {ClientDetail} clientDetail Data to be set to request.
     * @returns {string} Returns xml block.
     */
    protected getClientDetailXML(clientDetail: ClientDetail): string {
        const clientDetailXMl = `<ClientDetail>`
            + `<AccountNumber>${clientDetail.accountNumber}</AccountNumber>`
            + `<MeterNumber>${clientDetail.meterNumber}</MeterNumber>`
            + '</ClientDetail>';
        return clientDetailXMl;
    }
    /**
     * @description Gets TransactionDetail xml object.
     * @param {string} action Action to be called
     * @returns {string} Returns XML object.
     */
    protected getTransactionDetailXML(action: string): string {
        const customerTransactionId: string = this.generateCustomerTransactionId();
        const transactionDetailXMl = `<TransactionDetail>`
            + ` <CustomerTransactionId>WDSA-${action.toUpperCase()}-${customerTransactionId}</CustomerTransactionId>`
            + ` </TransactionDetail>`;
        return transactionDetailXMl;
    }
    /**
     * @description Creates a version xml block, setting received properties.
     * @param {SOAPServiceVersion} soapServiceVersion  Data to be setting.
     * @returns {string} Returns version xml block.
     */
    protected getVersionXML(soapServiceVersion: SOAPServiceVersion): string {
        const versionXML = `<Version>`
            + `<ServiceId>${soapServiceVersion.serviceId}</ServiceId>`
            + `<Major>${soapServiceVersion.major}</Major>`
            + `<Intermediate>${soapServiceVersion.intermediate}</Intermediate>`
            + `<Minor>${soapServiceVersion.minor}</Minor>`
            + `</Version>`;
        return versionXML;
    }
    /**
     * @description Gets Shipper xml object.
     * @param {ShipmentData} shipperLocation Data shipper to be will set.
     * @returns {string} Returns  Shipper xml.
     */
    protected getShipperXML(shipperLocation: ShipmentData, isShipmentRequest: boolean): string {
        const contactInfo = new ContactInfo({
            personName: shipperLocation.name,
            corporateName: shipperLocation.corporateName,
            phoneNumber: shipperLocation.phoneNumber,
            emailAddress: shipperLocation.email,
        });
        const shipperXML = `<Shipper>`
            + `${this.getContactInfoXML(contactInfo, isShipmentRequest)} `
            + `<Address> `
            + `${this.getStreetLinesXML(shipperLocation)} `
            + `<City>${shipperLocation.neighborhood}</City> `
            + `<PostalCode>${shipperLocation.zipcode}</PostalCode> `
            + `<CountryCode>${shipperLocation.countryCode}</CountryCode> `
            + `</Address> `
            + `</Shipper> `;
        return shipperXML;
    }
    /**
     * @description Gets Recipient xml object.
     * @param {ShipmentData} recipientLocation Data recipient to be will set.
     * @returns {string} Returns  Recipient xml.
     */
    protected getRecipientXML(recipientLocation: ShipmentData, isShipmentRequest: boolean): string {
        const contactInfo = new ContactInfo({
            personName: recipientLocation.name,
            corporateName: recipientLocation.corporateName,
            phoneNumber: recipientLocation.phoneNumber,
            emailAddress: recipientLocation.email,
        });
        const recipientXML = `<Recipient>`
            + `${this.getContactInfoXML(contactInfo, isShipmentRequest)}`
            + `<Address>`
            + `${this.getStreetLinesXML(recipientLocation)}`
            + `<City>${recipientLocation.neighborhood}</City>`
            + `<PostalCode>${recipientLocation.zipcode}</PostalCode>`
            + `<CountryCode>${recipientLocation.countryCode}</CountryCode>`
            + `</Address>`
            + `</Recipient>`;
        return recipientXML;
    }
    /**
     * @description Gets RequestedPackageLineItems xml object.
     * @param {RequestedPackageLineItems} requestdPackageLineItems The packages on shipment.
     * @returns {string} Returns RequestedPackageLineItems xml.
     */
    protected getRequestedPackageLineItemsXML(requestedPackageLineItems: RequestedPackageLineItem[]): string {
        let sequenceNumber = this.INITAL_SEQUENCE_NUMBER;
        let requestedPackageLineItemsXML = this.EMPTY_STRING;
        _.forEach(requestedPackageLineItems, (requestedPackageLineItem: RequestedPackageLineItem) => {
            const dimensionsInfo: DimensionsInfo = requestedPackageLineItem.dimensionsInfo;
            requestedPackageLineItemsXML += `<RequestedPackageLineItems>`
                + `<SequenceNumber>${sequenceNumber}</SequenceNumber>`
                + `<GroupNumber>${sequenceNumber}</GroupNumber>`
                + `<GroupPackageCount>${sequenceNumber++}</GroupPackageCount>`
                + `<Weight>`
                + `<Units>${this.WEIGHT_UNITS}</Units>`
                + `<Value>${this.checkWeightValueForDocument(dimensionsInfo.weight, requestedPackageLineItem.packageType)}</Value>`
                + `</Weight>`
                + `<Dimensions>`
                + `<Length>${dimensionsInfo.length}</Length>`
                + `<Width>${dimensionsInfo.width}</Width>`
                + `<Height>${dimensionsInfo.height}</Height>`
                + `<Units>${this.DIMENSIONS_UNITS}</Units>`
                + `</Dimensions>`
                + `<CustomerReferences>`
                + `<CustomerReferenceType>${this.CUSTOMER_REFERENCE_TYPE}</CustomerReferenceType>`
                + `<Value>${requestedPackageLineItem.referenceRecipient}</Value>`
                + `</CustomerReferences>`
                + `<ContentRecords>`
                + `<Description>${requestedPackageLineItem.description}</Description>`
                + `</ContentRecords>`
                + `</RequestedPackageLineItems>`;
        });
        return requestedPackageLineItemsXML;
    }
    /***
     *@description Generates a unique id with timestamp.
     *@returns {string} Return unique id.
     */
    protected generateCustomerTransactionId(): string {
        let customerTransactionId = uuid();
        customerTransactionId += '-' + Date.now();
        return customerTransactionId;
    }
    /**
     * @description Gets TotalInsured xml if isInsured is true.
     * @param {TotalInsured} totalInsured Insured data.
     * @returns {string} Returns Empty/TotalInsured xml
     */
    protected getTotalInsuredXML(totalInsured: TotalInsured, packageType: string): string {
        let totalInsuredXML: string;
        if (totalInsured.isInsured) {
            totalInsuredXML = `<TotalInsuredValue> `
                + `<Currency>${this.CURRENCY_USD}</Currency>`
                + `<Amount>${this.getInsuranceAmount(packageType, totalInsured.amount)}</Amount>`
                + `</TotalInsuredValue>`;
        } else {
            totalInsuredXML = this.EMPTY_STRING;
        }
        return totalInsuredXML;
    }
    /**
     * @description Gets ShippingChargesPayment xml object.
     * @param {string} accountNumber Account number where to be shippeing charges.
     * @returns {string} Returns ShippingChargesPayment xml.
     */
    protected getShippingChargesPaymentXML(accountNumber: string, isShipmentRequest: boolean): string {
        const shippingChargesPaymentXML = `<ShippingChargesPayment>`
            + `<PaymentType>${this.SENDER_PAYMENT_TYPE}</PaymentType>`
            + `<Payor>`
            + `<ResponsibleParty>`
            + `<AccountNumber>${accountNumber}</AccountNumber>`
            + `</ResponsibleParty>`
            + `</Payor>`
            + `</ShippingChargesPayment>`;
        return shippingChargesPaymentXML;
    }
    /**
     * @description
     * @returns {string}
     */
    protected getLabelSpecificationXML(): string {
        const labelSpecification = `<LabelSpecification>`
            + `<LabelFormatType>${this.LABEL_FORMAT_TYPE}</LabelFormatType>`
            + `<ImageType>${this.IMAGE_TYPE}</ImageType>`
            + `<LabelStockType>${this.LABEL_STOCK_TYPE}</LabelStockType>`
            + `</LabelSpecification>`;
        return labelSpecification;
    }
    /**
     * @description Gets a packaging type depending on contents.
     * @param {string} packageType content type.
     * @returns {string} Returns packaging type depending on contents
     */
    protected getPackagingType(contentType: string): string {
        let packagingType: string;
        if (contentType && contentType.toUpperCase() === this.DOCUMENTS_TYPE) {
            packagingType = this.PACKAGING_TYPE_ENVELOPE;
        } else {
            packagingType = this.PACKAGING_TYPE_CUSTOM;
        }
        return packagingType;
    }
    protected getCustomsClearanceDetailXML(isForeign: boolean, insured: TotalInsured): string {
        let customsClearanceDetailXML: string;
        if (isForeign) {
            let amount: number;
            if (insured.isInsured) {
                amount = insured.amount;
            } else {
                amount = this.MINIMUM_AMOUNT;
            }
            customsClearanceDetailXML = `<CustomsClearanceDetail>`
                + `<Commodities>`
                + `<CustomsValue>`
                + `<Currency>${this.CURRENCY_USD}</Currency>`
                + `<Amount>${amount}</Amount>`
                + `</CustomsValue>`
                + `</Commodities>`
                + `</CustomsClearanceDetail>`;
        } else {
            customsClearanceDetailXML = this.EMPTY_STRING;
        }
        return customsClearanceDetailXML;

    }
    /**
     * @description Gets a FEDEX notification.
     * @param  {FedexShipmentResponse} fedexResponse
     * @returns {FedexNotificationResponse} Returns a FEDEX notification.
     */
    protected getFedexNotification(notifications: FedexNotificationResponse[]): FedexNotificationResponse {
        let notification: FedexNotificationResponse;
        if (_.isArray(notifications)) {
            notification = _.first(notifications);
        } else {
            notification = notifications;
        }
        return notification;
    }
    /**
     * @description Transfort string response for Fedex.
     * @param {any} dataResponse
     * @param {string} namespace
     * @returns {string} Returns response without namespace string.
     */
    protected cleanResponse(dataResponse: any, namespace: string): string {
        return dataResponse.replace(new RegExp(namespace, 'g'), '');
    }
    /**
     * @description Gets Contact xml object.
     * @param {ContactInfo} contactInfo Data to be set.
     * @returns {string} Returns constac xml.
     */
    private getContactInfoXML(contactInfo: ContactInfo, isShipmentRequest: boolean): string {
        let contactBlock: string;
        if (isShipmentRequest) {
            contactBlock = `<Contact>`
                + `<PersonName>${contactInfo.personName}</PersonName>`
                + `<CompanyName>${contactInfo.corporateName}</CompanyName>`
                + `<PhoneNumber>${contactInfo.phoneNumber}</PhoneNumber>`
                + `<EMailAddress>${contactInfo.emailAddress}</EMailAddress>`
                + `</Contact>`;
        } else {
            contactBlock = this.EMPTY_STRING;
        }
        return contactBlock;
    }
    /**
     * @description Gets StreetLines XML.
     * @param {ShipmentData} shipmentData Shipment data.
     * @returns {string} StreetLines XML object.
     */
    private getStreetLinesXML(shipmentData: ShipmentData): string {
        let streetLines: string;
        let secondStreetLines: string;
        if (shipmentData.fullAddress && shipmentData.secondaryAddress && shipmentData.neighborhood && shipmentData.city) {
            streetLines = `${shipmentData.fullAddress}`;
            secondStreetLines = `${shipmentData.secondaryAddress}`;
        } else {
            streetLines = this.EMPTY_STRING;
            secondStreetLines = this.EMPTY_STRING;
        }
        const streetLinesXML = `<StreetLines>${streetLines}</StreetLines><StreetLines>${secondStreetLines}</StreetLines>`;
        return streetLinesXML;
    }
    /**
     * @description Gets a insurance amount validate maximum by package type
     * @param {string} packageType The shipment content.
     * @param {number} amount The value that customers provieded.
     * @returns {number} Returns de value amount after validate.
     */
    private getInsuranceAmount(packageType: string, amount: number): number {
        let insuranceAmount: number;
        if (packageType.toUpperCase() === this.DOCUMENTS_TYPE) {
            if (amount > 5000) {
                insuranceAmount = 5000;
            } else {
                insuranceAmount = amount;
            }
        } else {
            if (amount > 150000) {
                insuranceAmount = 150000;
            } else {
                insuranceAmount = amount;
            }
        }
        return insuranceAmount;
    }
    /**
     * @description Check if the contents is envelope do not exceed the permitted weight.
     * @param {number} weight The weight in shipment.
     * @param {string} packageType The type of package in shipment.
     * @returns {number} Returns the weight or throws an error if exceed the permitted weight.
     */
    private checkWeightValueForDocument(weight: number, packageType: string): number {
        let weightValue: number;
        if (packageType.toUpperCase() === this.DOCUMENTS_TYPE && weight > this.WEIGHT_DOCUMENT_MAXIMUM_VALUE) {
            throw new GenericBussinessLogicError('Weight - Package weight exceeds maximum for requested service/packaging 1');
        } else {
            weightValue = weight;
        }
        return weightValue;

    }
    /**
     * @description Creates object with params received that contains FEDEX credential.
     * @param {Credential} fedexData Data to be will be set that delivery service.
     * @returns {FedexCredential} Returns object with FEDEX credential.
     */
    private createFedexCredentialObject(credentialDataByType: Credential): FedexCredential {
        const fedexCredentialOptions: FedexCredentialOptions = this.getFedexConfigOptionsObject(credentialDataByType.options);
        const fedexCredential: FedexCredential = {
            webAuthenticationDetail: {
                userCredential: {
                    key: credentialDataByType.username,
                    password: credentialDataByType.password,
                },
            },
            clientDetail: {
                accountNumber: fedexCredentialOptions.account,
                meterNumber: fedexCredentialOptions.meterNumber,
            },
            version: fedexCredentialOptions.serviceVersion,
        };
        return fedexCredential;
    }
}
