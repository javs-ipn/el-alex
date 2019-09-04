import { Dimensions } from './dhl-dimensions.interface';

export interface RequestedPackages {
    '@number': number;
    Weight: number;
    CustomerReferences: string;
    Dimensions: Dimensions;
    InsuredValue?: number;
    PackageContentDescription?: string;
}
