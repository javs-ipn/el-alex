import { DimensionsInfo } from './../../../Credential/Fedex/DimensionsInfo/dimensions-info.class';

export interface RequestedPackageLineItem {
    dimensionsInfo: DimensionsInfo;
    description: string;
    packageType: string;
    referenceRecipient: string;
}
