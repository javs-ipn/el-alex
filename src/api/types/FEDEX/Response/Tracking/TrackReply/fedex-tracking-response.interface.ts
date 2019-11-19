import { CompletedTrackDetails } from './completed-track-details.interface';
import { FedexResponseBase } from '../../fedex-response-base.interface';

export interface FedexTrackingResponse extends FedexResponseBase {
    CompletedTrackDetails: CompletedTrackDetails;
}
