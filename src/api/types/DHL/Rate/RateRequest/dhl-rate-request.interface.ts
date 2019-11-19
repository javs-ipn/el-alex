import { RequestedShipment } from './dhl-rate-requested-shipment.interface';

export interface RateRequest {
    ClientDetails: string;
    RequestedShipment: RequestedShipment;
}
