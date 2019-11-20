import { Dimensions } from './dhl.rate-dimensions.interface';
import { Weight } from './dhl-rate-weight-interface';

export interface RequestedPackages {
    RequestedPackages: {
        '@number': number;
        'Weight': Weight;
        'Dimensions': Dimensions;
    };

}
