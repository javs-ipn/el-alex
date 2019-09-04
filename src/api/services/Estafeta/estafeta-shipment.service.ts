import { CustomEstafetaLabelResponse } from './../../types/Estafeta/custom-label-response.interface';
import * as XMLJS from 'xml2js';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios';
import { PackageDimension } from '../../types/PackageDimensions/package-dimensions.class';
import { GenericBussinessLogicError } from './../../errors/Generic/generic-bussinessLogic.error';
import { ConfigOptions } from './../../types/Estafeta/config-options.interface';
import { Credential } from './../../models/Credential/Credential';
import { Rate } from './../../models/Rate/rate.model';
import { Service } from 'typedi';

@Service()
export class EstafetaShipmentService {
    public static PAPER_TYPE = '1';
    public static QUADRANT = '0';
    public static VALID = 'true';
    public static NO_DELIVERY_TO_ESTAFETA_OFFICE = '0';
    public static DELIVERY_TO_ESTAFETA_OFFICE = '1';
    public static REGULAR_PICKUP = 'REGULAR_PICKUP';
    public static PARCEL_TYPE = '4';
    public static RETURN_DOCUMENT = 'false';
    public static MERCHANDISE = 'Nacional';
    public static SINGLE_LABEL_REQUEST = '1';
    public static ADDRESS_BEGIN_INDEX = 0;
    public static STREET_LINE_1_INDEX = 30;
    public static STREET_LINE_2_INDEX = 60;

    public static headerString = `<soapenv:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'`
        + ` xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/'`
        + ` xmlns:est='http://estafetalabel.webservices.estafeta.com'>`
        + `<soapenv:Header/>`
        + `<soapenv:Body>`
        + `<est:createLabelExtended soapenv:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>`
        + `<in0>`;
    public static footerString = `</in0>`
        + `</est:createLabelExtended>`
        + `</soapenv:Body>`
        + `</soapenv:Envelope>`;

    /**
     * @description Creates a single xml string for only one pdf per request
     * @param {Rate} rate - Rate information to create shipment request
     * @returns {string} - XML string to make a soap call to estafeta
     */
    public createSingleRequestXmlString(rate: Rate, credential: Credential): string {
        const shipmentRequestString =
            `${EstafetaShipmentService.headerString}${this.createConfigString(credential)}`
            + `${this.createWaybillInfoString(rate, credential)}`
            + `${EstafetaShipmentService.footerString}`;
        return shipmentRequestString;
    }

    /**
     * @description Calls for ESTAFETA soap createLabelExtented and  chaining promises and resolves them
     * @param {string} requestedString XML string needed by the soap call
     * @param {Credential} credential Credential found for tenant
     * @returns
     */
    public async requestSingleLabelEstafetaExtended(requestedString: string, credential: Credential): Promise<CustomEstafetaLabelResponse[]> {

        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/xml',
                'Accept': 'application/json',
                'SOAPAction': `${credential.courier.shipmentAction}`,
            },
        };
        const estafetaLabelRequest: Array<AxiosPromise<any>> = [];
        const axiosRequest = axios.post(credential.courier.shipmentRequestUrl, requestedString, axiosRequestConfig);
        estafetaLabelRequest.push(axiosRequest);

        return await Promise.all(estafetaLabelRequest)
            .then((results: Array<AxiosResponse<any>>) => {
                const options = { explicitArray: false, tagNameProcessors: [XMLJS.processors.stripPrefix] };
                const shipmentResponse: any[] = [];
                results.forEach(async (axiosResponse: AxiosResponse<any>) => {
                    await XMLJS.parseString(axiosResponse.data, options, async (err, result) => {
                        if (err === null) {
                            shipmentResponse.push(result.Envelope.Body.multiRef);
                        }
                    });
                });
                // @TODO - Handle response for bussiness logic
                return Promise.resolve(shipmentResponse);
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
            const configOptionsObject: ConfigOptions = this.createConfigOptionsObject(credential);
            configString = `<customerNumber>${configOptionsObject.customerNumber}</customerNumber>
            <login>${credential.username}</login>
            <paperType>${EstafetaShipmentService.PAPER_TYPE}</paperType>
            <password>${credential.password}</password>
            <quadrant>${EstafetaShipmentService.QUADRANT}</quadrant>
            <suscriberId>${configOptionsObject.suscriberId}</suscriberId>
            <valid>${EstafetaShipmentService.VALID}</valid>`;
        } else {
            throw new GenericBussinessLogicError('No configuration options found for ESTAFETA check id =' + credential.courier.id);
        }
        return configString;
    }

    /**
     * @description Creates the origin/destination string information
     * @param {Rate} rate - Rate to create the waybill for
     * @param {Credential} credential - Credential found for tenant
     * @returns {string} origin/destination string
     */
    private createWaybillInfoString(rate: Rate, credential: Credential): string {
        const packagesInfo: PackageDimension[] = JSON.parse(rate.dimensionsPackages);
        const courierService = rate.service;
        const configOptionsObject: ConfigOptions = this.createConfigOptionsObject(credential);
        let shipmentRequestString = '';
        shipmentRequestString = `<labelDescriptionList>
            <content>${rate.contentDescription}</content>
            <deliveryToEstafetaOffice>${this.deliveryPickup(rate.deliveryType)}</deliveryToEstafetaOffice>
            <destinationInfo>
            <address1>${rate.recipientStreetLines1.slice(EstafetaShipmentService.ADDRESS_BEGIN_INDEX, EstafetaShipmentService.STREET_LINE_1_INDEX)}</address1>
            <address2>${rate.recipientStreetLines1.slice(EstafetaShipmentService.STREET_LINE_1_INDEX, EstafetaShipmentService.STREET_LINE_2_INDEX)}</address2>
                <city>${rate.cityDestination}</city>
                <betweenStreet>PRUEBAAAAAAAAA</betweenStreet>
                <contactName>${rate.contactNameDestination}</contactName>
                <corporateName>${rate.corporateNameDestination}</corporateName>
                <customerNumber>${configOptionsObject.customerNumber}</customerNumber>
                <neighborhood>${rate.recipientStreetLines1.slice(EstafetaShipmentService.STREET_LINE_2_INDEX)}</neighborhood>
                <state>${rate.cityDestination}</state>
                <valid>${EstafetaShipmentService.VALID}</valid>
                <zipCode>${rate.zipcodeDestination}</zipCode>
                <phoneNumber>${rate.phoneNumberDestination}</phoneNumber>
            </destinationInfo>
            <numberOfLabels>${packagesInfo.length}</numberOfLabels>
            <officeNum>${configOptionsObject.officeNum}</officeNum>
            <originInfo>
                <address1>${rate.shipperStreetLines1.slice(EstafetaShipmentService.ADDRESS_BEGIN_INDEX, EstafetaShipmentService.STREET_LINE_1_INDEX)}</address1>
                <address2>${rate.shipperStreetLines1.slice(EstafetaShipmentService.STREET_LINE_1_INDEX, EstafetaShipmentService.STREET_LINE_2_INDEX)}</address2>
                <city>${rate.cityOrigin}</city>
                <betweenStreet>BON JOVI</betweenStreet>
                <contactName>${rate.contactNameOrigin}</contactName>
                <corporateName>${rate.corporateNameOrigin}</corporateName>
                <customerNumber>${configOptionsObject.customerNumber}</customerNumber>
                <neighborhood>${rate.shipperStreetLines1.slice(EstafetaShipmentService.STREET_LINE_2_INDEX)}</neighborhood>
                <state>${rate.cityOrigin}</state>
                <valid>${EstafetaShipmentService.VALID}</valid>
                <zipCode>${rate.zipcodeOrigin}</zipCode>
                <phoneNumber>${rate.phoneNumberOrigin}</phoneNumber>
            </originInfo>
            <originPallet>
                <merchandise>${EstafetaShipmentService.MERCHANDISE}</merchandise>
            </originPallet>
            <parcelTypeId>${EstafetaShipmentService.PARCEL_TYPE}</parcelTypeId>
            <reference>${rate.recipientReference}</reference>
            <returnDocument>${EstafetaShipmentService.RETURN_DOCUMENT}</returnDocument>
            <serviceTypeId>${courierService.serviceCode}</serviceTypeId>
            <valid>${EstafetaShipmentService.VALID}</valid>
            <weight>${this.getTotalWeight(packagesInfo)}</weight>
            <originZipCodeForRouting>${rate.zipcodeOrigin}</originZipCodeForRouting>
            <destinationCountryId>${rate.countryCodeDestination}</destinationCountryId>
        </labelDescriptionList>
        <labelDescriptionListCount>${EstafetaShipmentService.SINGLE_LABEL_REQUEST}</labelDescriptionListCount>`;
        return shipmentRequestString;
    }

    /**
     * @description Parses the config options stored in credentials for the tenant
     * @param {Credential} credential - Credential found for the tenant
     * @returns {ConfigOptions} - Parsed config options
     */
    private createConfigOptionsObject(credential: Credential): ConfigOptions {
        const configOptionsObject: ConfigOptions = JSON.parse(credential.options);
        return configOptionsObject;
    }

    /**
     * @description Gets the value for regular pickup or request courier dropoff
     * @param {string} deliveryPickupSaved - Dropoff saved
     * @returns {string} '1' for request courier pickup and '0' for regular dropoff in estafeta office
     */
    private deliveryPickup(deliveryPickupSaved: string): string {
        let deliveryToEstafetaOffice = EstafetaShipmentService.NO_DELIVERY_TO_ESTAFETA_OFFICE;
        if (deliveryPickupSaved !== EstafetaShipmentService.REGULAR_PICKUP) {
            deliveryToEstafetaOffice = EstafetaShipmentService.DELIVERY_TO_ESTAFETA_OFFICE;
        }
        return deliveryToEstafetaOffice;
    }

    /**
     * @description - Gets the total weight for the packages
     * @param {RatePackage} ratePackages - Packages to be rated
     * @returns {number} total weight
     */
    private getTotalWeight(packagesDimensionsInfo: PackageDimension[]): number {
        let totalWeight = 0;
        packagesDimensionsInfo.map((packageDimension: PackageDimension) => {
            const packageDimensionObject = new PackageDimension();
            packageDimensionObject.dimensions = packageDimension.dimensions;
            packageDimensionObject.packageNumber = packageDimension.packageNumber;
            totalWeight += this.getDimensionValue(packageDimensionObject, PackageDimension.WEIGHT_INDEX);
        });
        return totalWeight;
    }

    /**
     * @description - Gets the value for the package dimesion info given and the property index defined by PackageDimension class
     * @param {PackageDimension} packageDimensionObject - dimension object to get value of
     * @param {number} propertyIndex Property index defined by PackageDimension object
     * @returns {number} - property value
     */
    private getDimensionValue(packageDimensionObject: PackageDimension, propertyIndex: number): number {
        const splitedString = packageDimensionObject.splitDimensionsString(packageDimensionObject.dimensions);
        const convertedValue = Number.parseFloat(splitedString[propertyIndex]);
        return convertedValue;
    }
}
