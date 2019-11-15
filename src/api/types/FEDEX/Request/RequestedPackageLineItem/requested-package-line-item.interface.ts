import { DimensionsInfo } from '../../../../../../../waybill-delivery-service-api/src/api/types/DimensionsInfo/dimensions-info.class';

export interface RequestedPackageLineItem {
    dimensionsInfo: DimensionsInfo;
    description: string;
    packageType: string;
    referenceRecipient: string;
}
