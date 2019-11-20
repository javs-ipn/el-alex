import { Dimensions } from './dhl.rate-dimensions.interface';
import { Weight } from './dhl-rate-weight-interface';

export interface RequestedPackageItem {
    '@number': number;
    'Weight': Weight;
    'Dimensions': Dimensions;
}
