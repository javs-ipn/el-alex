import { CompletedShipmentDetail } from '../CompletedShipmentDetail/completed-shipment-detail.interface';
import { FedexResponseBase } from '../../fedex-response-base.interface';

export interface FedexShipmentResponse extends FedexResponseBase {
    JobId: string;
    CompletedShipmentDetail: CompletedShipmentDetail;
}
