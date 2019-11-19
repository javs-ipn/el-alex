import { ArrayOfAWBInfoItem } from './dhl-tracking-array-info-item.interface';
import { ServiceHeader } from './../TrackingRequest/dhl-tracking-service-header.interface';

export interface TrackingResponse {
    Response: {
        ServiceHeader: ServiceHeader
    };
    AWBInfo: {
        ArrayOfAWBInfoItem: ArrayOfAWBInfoItem[] | ArrayOfAWBInfoItem;
    };
}
