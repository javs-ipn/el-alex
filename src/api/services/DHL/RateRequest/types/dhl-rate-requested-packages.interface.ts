import { Dimensions } from './dhl.rate-dimensions.interface';
import { Weight } from './dhl-rate-weight-interface';

export interface RequestedPackages {
    number: string;
    Weight: Weight;
    Dimensions: Dimensions;
}
