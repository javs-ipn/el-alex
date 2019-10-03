import { RatePackageDimensions } from './rate-package-dimensions.interface';
import { PackageInsurance } from './rate-package-insurance.interface';
import { RateInfo } from './rate-info.interface';

export interface RateData {
    courierName: string;
    hasCoverage?: boolean;
    packageInfo?: RatePackageDimensions;
    insurance?: PackageInsurance;
    originZipCode?: string;
    destinationZipCode?: string;
    rates: RateInfo[];
}
