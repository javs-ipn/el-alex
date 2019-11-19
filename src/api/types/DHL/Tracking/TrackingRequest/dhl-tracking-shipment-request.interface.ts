import { TrackingRequest } from './dhl-tracking-request.interface';

export interface TrackShipmentRequest {
    trackingRequest: {
        TrackingRequest: TrackingRequest,
    };
}
