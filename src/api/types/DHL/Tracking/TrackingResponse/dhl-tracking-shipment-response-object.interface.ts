import { TrackingResponse } from './dhl-tracking-response.interface';

export interface TrackShipmentRequestResponse {
    trackingResponse: {
        TrackingResponse: TrackingResponse;
    };
}
