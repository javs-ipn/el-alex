import { ServiceHeader } from './dhl-tracking-service-header.interface';

export interface TrackingRequest {

    Request: { ServiceHeader: ServiceHeader; };
    AWBNumber: { ArrayOfAWBNumberItem: string; };
    LevelOfDetails: string;
    PiecesEnabled: string;

}
