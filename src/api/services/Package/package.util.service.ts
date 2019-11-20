import { Currency } from './../../types/enums/currency-enum';
import { RateCourierServiceType } from './../../types/RateResponse/rate-courier-service-type.interface';
import { CourierRate } from './../../types/RateResponse/courier-rate.interface';
import { GenericRateResponse } from './../../types/RateResponse/generic-rate-response.interface';
import { Rate } from './../../models/Rate/rate.model';
import * as _ from 'lodash';
import { RatePackage } from './../../types/RateRequest/rate-package.class';
import { RatePackageDimensions } from './../../types/RateRequest/rate-package-dimensions.class';

export class PackageUtilService {

    /**
     * @description Gets the total dimensions for the packages to rate
     * @param {RatePackage[]} packages - To rate packages
     * @returns {RatePackageDimensions} - Total package dimensions
     */
    public static getTotalDimensions(packages: RatePackage[]): RatePackageDimensions {
        const totalDimensions: RatePackageDimensions = {
            width: 0,
            height: 0,
            length: 0,
            weight: 0,
        };
        _.forEach(packages, (ratePackage: RatePackage) => {
            totalDimensions.height += ratePackage.packageInfo.height;
            totalDimensions.width += ratePackage.packageInfo.width;
            totalDimensions.length += ratePackage.packageInfo.length;
            totalDimensions.weight += ratePackage.packageInfo.weight;
        });
        return totalDimensions;
    }

    /**
     * @description Gets the dimensions array for all the rated packages
     * @param {RatePackage[]} ratePackages Rated packages
     * @returns {string} JSON string for the dimensions array
     */
    public static getDimensionsJsonObjectOfAllPackages(ratePackages: RatePackage[]): string {
        const packageDimensions: RatePackageDimensions[] = [];
        _.forEach(ratePackages, (ratedDimensionsPackage) => {
            packageDimensions.push(ratedDimensionsPackage.packageInfo);
        });
        return JSON.stringify(packageDimensions);
    }

    /**
     * @description Checks if the rate has a multiple package
     * @param {RatePackage[]} ratePackage Rated packages
     * @returns {boolean} Wether is multiple shipment or not
     */
    public static isMultipleShipment(ratePackage: RatePackage[]): boolean {
        let isMultiple: boolean;
        if (_.size(ratePackage) > 1) {
            isMultiple = true;
        } else {
            isMultiple = false;
        }
        return isMultiple;
    }

    /**
     * @description Gets the generic Rate response from the saved rates
     * @param {string} courier - Related courier name
     * @param {Rate[]} rates Created rates
     * @returns {GenericRateResponse} - Generic rate response
     */
    public static getGenericRateResponse(courier: string, rates: Rate[]): GenericRateResponse {
        const genericResponse: GenericRateResponse = {
            rates: [],
        };
        const genericDHLRate: CourierRate = {
            name: courier,
            services: [],
        };
        _.forEach(rates, (rate: Rate) => {
            const courierServiceType: RateCourierServiceType = {
                amount: rate.totalPrice,
                chargesDetail: JSON.parse(rate.additionalCharges),
                currency: Currency.MXN,
                estimatedDeliveryDate: '',
                rateId: rate.id,
                serviceName: '',
            };
            genericDHLRate.services.push(courierServiceType);
        });

        genericResponse.rates.push(genericDHLRate);
        return genericResponse;
    }
}
