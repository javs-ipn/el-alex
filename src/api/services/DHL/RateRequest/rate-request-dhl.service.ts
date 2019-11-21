import * as _ from 'lodash';
import * as moment from 'moment';
import * as uuid from 'uuid';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Charge } from './../../../types/DHL/Rate/RateResponse/dhl-charge.interface';
import { Charges } from './../../../types/DHL/Rate/RateResponse/dhl-charges.interface';
import { ChargesDetail } from './../../../types/RateResponse/charges-detail.interface';
import { Courier } from './../../../models/Courier/Courier';
import { CourierService } from './../../../models/CourierService/CourierService';
import { DHL_CONSTANTS } from './../../../types/DHL/Constants/dhl-constants';
import { DHLBaseService } from '../Base/base-dhl.service';
import { DHLOptions } from '../../../types/DHL/Options/dhl-options.interface';
import { DHLRateResponseObject } from './../../../types/DHL/Rate/RateResponse/dhl-rate-response-object.interface';
import { DropOff } from './../../../types/enums/dropoff-enum';
import { GenericBussinessLogicError } from './../../../errors/Generic/generic-bussinessLogic.error';
import { GenericRateObject } from './../../../types/RateRequest/generic-rate-object.class';
import { HashService } from '../../Hash/hash-methods.service';
import { Notification } from './../../../types/DHL/Rate/RateResponse/dhl-notification.interface';
import { PackageUtilService } from './../../Package/package.util.service';
import { Provider } from './../../../types/DHL/Rate/RateResponse/dhl-provider.interface';
import { Rate } from './../../../models/Rate/rate.model';
import { RatePackage } from './../../../types/RateRequest/rate-package.class';
import { RatePackageDimensions } from './../../../types/RateRequest/rate-package-dimensions.class';
import { RateRequestObjectDHL } from '../../../types/DHL/Rate/RateRequest/dhl-rate-request-object.interface';
import { RateServiceObject } from './../../../types/DHL/Rate/RateResponse/dhl-service.interface';
import { RequestedPackageItem } from './../../../types/DHL/Rate/RateRequest/dhl-rate-requested-package.interface';
import { Service } from 'typedi';
@Service()
export class DHLRateService extends DHLBaseService {

    constructor(private hashService: HashService) {
        super();
    }

    /**
     * @description - DHL rate request
     * @param {RateRequestObjectDHL} rateRequest - Dhl rate request data
     * @param {DHLOptions} options Object containing the url, username and password
     * @returns {Promise<DHLRateResponseObject>} Response from dhl
     */
    public async rateRequest(rateRequest: RateRequestObjectDHL, options: DHLOptions): Promise<DHLRateResponseObject> {
        const hashedString = this.hashService.basicUsernamePassword(options.username, options.password);
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${hashedString}`,
            },
        };
        const dhlRateRequest: AxiosPromise<DHLRateResponseObject> = axios.post(options.url, rateRequest, axiosRequestConfig);
        return await dhlRateRequest
            .then((dhlRateResponse: AxiosResponse<DHLRateResponseObject>) => {
                const rateResponse: DHLRateResponseObject = dhlRateResponse.data;
                this.handleRateResponse(rateResponse);
                return Promise.resolve(rateResponse);
            }).catch((error) => {
                if (!_.has(error, 'request')) {
                    throw new GenericBussinessLogicError(error.message);
                } else {
                    throw new GenericBussinessLogicError(error.response.data);
                }
            });
    }

    /**
     * @description  Generates the rate object to request dhl rate service
     * @param {GenericRateObject} genericRateObject - Generic Rate object with shipment info
     * @param {DeliveryService} deliveryService - Related delivery service
     * @returns {RateRequestObjectDHL} - Rate object needed by dhl
     */
    public generateRateObject(
        genericRateObject: GenericRateObject, dhlOptions: DHLOptions): RateRequestObjectDHL {
        const shipmentDate = moment().add(2, 'm');
        const firstPackageToRate = _.first(genericRateObject.packages);
        const shipmetString = shipmentDate.format(DHL_CONSTANTS.DATE_FORMAT);
        const rateRequestObject: RateRequestObjectDHL = {
            RateRequest: {
                ClientDetails: '',
                RequestedShipment: {
                    DropOffType: DHL_CONSTANTS.DROPOFFTYPE,
                    ShipTimestamp: shipmetString,
                    UnitOfMeasurement: DHL_CONSTANTS.UNIT_OF_MEASUREMENT,
                    Content: firstPackageToRate.shipmentRateDetail.contentType,
                    PaymentInfo: DHL_CONSTANTS.PAYMENT_INFO,
                    NextBusinessDay: DHL_CONSTANTS.NEXT_BUSSINESS_DAY,
                    Account: dhlOptions.account,
                    Ship: {
                        Shipper: {
                            City: genericRateObject.shipperLocation.cityName,
                            PostalCode: genericRateObject.shipperLocation.zipcode,
                            CountryCode: genericRateObject.shipperLocation.countryISOCode,
                        },
                        Recipient: {
                            City: genericRateObject.recipientLocation.cityName,
                            PostalCode: genericRateObject.recipientLocation.zipcode,
                            CountryCode: genericRateObject.recipientLocation.countryISOCode,
                        },
                    },
                    Packages: {
                        RequestedPackages: this.getPackageItems(genericRateObject.packages),

                    },
                },
            },
        };
        return rateRequestObject;
    }

    /**
     * @description Gets the rates to be saved
     * @param {Courier} relatedCourier - Related courier
     * @param {GenericRateObject} genericRateRequest - Generic rate request
     * @param {DHLRateResponseObject} dhlRateResponse  - DHL response for the request
     * @returns {Rate[]} Rates to be saved
     */
    public getRatesToBeSaved(relatedCourier: Courier, genericRateRequest: GenericRateObject, dhlRateResponse: DHLRateResponseObject): Rate[] {
        let rates: Rate[] = [];
        const providersFound = _.cloneDeep(dhlRateResponse.RateResponse.Provider);
        if (_.isArray(providersFound)) {
            const firstProvider = _.first(providersFound);
            rates = this.getRatesForExistingServices(relatedCourier, genericRateRequest, firstProvider.Service);
        }
        return rates;
    }

    /**
     * @description Gets all the rates for the existing services in our api
     * @param {Courier} relatedCourier - Related courier
     * @param {GenericRateObject} genericRateRequest - Generic rate request
     * @param {DHLRateResponseObject} dhlRateResponse  - DHL response for the request
     * @returns {Rate[]} Rates to be saved
     */
    public getRatesForExistingServices(relatedCourier: Courier, genericRateRequest: GenericRateObject, dhlRateResponse: RateServiceObject[]): Rate[] {
        const relatedCourierServices: CourierService[] = relatedCourier.courierServices;
        const rates: Rate[] = [];
        const internalId = uuid();
        const totalDimensions: RatePackageDimensions = PackageUtilService.getTotalDimensions(genericRateRequest.packages);
        const firstPackage = _.first(genericRateRequest.packages);
        _.forEach(dhlRateResponse, (serviceFound: RateServiceObject) => {
            const foundService = _.find(relatedCourierServices, (courierService: CourierService) => {
                return courierService.serviceCode === serviceFound['@type'];
            });
            if (foundService) {
                const rateToBeSaved: Rate = new Rate();
                rateToBeSaved.additionalCharges = this.getAdditionalChargesInJsonObject(serviceFound.Charges);
                rateToBeSaved.dimensionsPackages = PackageUtilService.getDimensionsJsonObjectOfAllPackages(genericRateRequest.packages);
                rateToBeSaved.extendedZoneShipment = this.hasExtendedZoneCharge(serviceFound.Charges);
                rateToBeSaved.multipleShipment = PackageUtilService.isMultipleShipment(genericRateRequest.packages);
                rateToBeSaved.internalId = internalId;
                rateToBeSaved.status = false;
                rateToBeSaved.rated = true;
                rateToBeSaved.cityDestination = genericRateRequest.recipientLocation.cityName;
                rateToBeSaved.cityOrigin = genericRateRequest.shipperLocation.cityName;
                rateToBeSaved.contentDescription = firstPackage.description;
                rateToBeSaved.countryCodeDestination = genericRateRequest.recipientLocation.countryISOCode;
                rateToBeSaved.countryCodeOrigin = genericRateRequest.shipperLocation.countryISOCode;
                rateToBeSaved.deliveryType = firstPackage.shipmentRateDetail.dropOffType;
                rateToBeSaved.packageType = firstPackage.shipmentRateDetail.contentType;
                rateToBeSaved.serviceId = foundService.id;
                rateToBeSaved.subTotalPrice = serviceFound.TotalNet.Amount;
                rateToBeSaved.tenantId = genericRateRequest.tenantId;
                rateToBeSaved.totalHeight = totalDimensions.height;
                rateToBeSaved.totalLength = totalDimensions.length;
                rateToBeSaved.totalPrice = serviceFound.TotalNet.Amount;
                rateToBeSaved.totalWeight = totalDimensions.weight;
                rateToBeSaved.totalWidth = totalDimensions.width;
                rateToBeSaved.zipcodeDestination = genericRateRequest.recipientLocation.zipcode;
                rateToBeSaved.zipcodeOrigin = genericRateRequest.shipperLocation.zipcode;
                if (rateToBeSaved.deliveryType === DropOff.REQUEST_COURIER) {
                    rateToBeSaved.pickupDate = new Date(serviceFound.DeliveryTime);
                }
                if (rateToBeSaved.insurance) {
                    rateToBeSaved.insurance = true;
                    rateToBeSaved.customsValue = firstPackage.customsValue;
                } else {
                    rateToBeSaved.insurance = false;
                    rateToBeSaved.customsValue = DHL_CONSTANTS.ZERO_VALUE;
                }
                rates.push(rateToBeSaved);
            }
        });
        return rates;
    }

    /**
     * @description Gets the charges detail in string form
     * @param {Charges} charge DHL charge object for the rate request
     * @returns {string} Charges detail array string
     */
    public getAdditionalChargesInJsonObject(charge: Charges): string {
        const chargesDetail: ChargesDetail[] = [];
        _.forEach(charge.Charge, (dhlCharge: Charge) => {
            chargesDetail.push({
                amount: dhlCharge.ChargeAmount,
                concept: dhlCharge.ChargeType,
            });
        });
        return JSON.stringify(chargesDetail);
    }

    /**
     * @description Checks if the dhl charge found has extended zone charge
     * @param {Charges} charge DHL charge object for the rate request
     * @returns {boolean} Wether the charge has extended
     */
    private hasExtendedZoneCharge(charge: Charges): boolean {
        let hasExtendedZoneCharge: boolean;
        const hasExtendedZoneItem = _.find(charge.Charge, (chargeFound: Charge) => {
            return chargeFound.ChargeType === DHL_CONSTANTS.REMOTE_AREA_DELIVERY;
        });
        if (hasExtendedZoneItem) {
            hasExtendedZoneCharge = true;
        } else {
            hasExtendedZoneCharge = false;
        }
        return hasExtendedZoneCharge;
    }

    /**
     * @description Handle if rate response has errors.
     * @param {DHLRateResponseObject} rateResponse Response dhl data.
     * @returns {void}
     */
    private handleRateResponse(rateResponse: DHLRateResponseObject): void {
        if (_.isArray(rateResponse.RateResponse.Provider)) {
            _.forEach(rateResponse.RateResponse.Provider, (provider: Provider) => {
                _.forEach(provider.Notification, (notification: Notification) => {
                    this.throwBussinessError(notification);
                });
            });
        } else {
            const onlyProvider: Provider = rateResponse.RateResponse.Provider;
            _.forEach(onlyProvider.Notification, (notification: Notification) => {
                this.throwBussinessError(notification);
            });
        }
    }

    /**
     * @description Creates the packages items to be rated
     * @param {RatePackage[]} packages Generic packages given
     * @returns {RequestedPackageItem[]} DHL package items
     */
    private getPackageItems(packages: RatePackage[]): RequestedPackageItem[] {
        const requestedPackages: RequestedPackageItem[] = [];
        packages.forEach((ratePackage: RatePackage, index: number) => {
            const packageItem: RequestedPackageItem = {
                '@number': index + 1,
                'Weight': {
                    Value: ratePackage.packageInfo.weight,
                },
                'Dimensions': {
                    Length: ratePackage.packageInfo.length,
                    Width: ratePackage.packageInfo.width,
                    Height: ratePackage.packageInfo.height,
                },
            };
            requestedPackages.push(packageItem);
        });
        return requestedPackages;
    }
}
