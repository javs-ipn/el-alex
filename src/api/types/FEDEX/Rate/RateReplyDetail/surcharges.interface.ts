import { Amount } from '../../Response/Shipment/ShipmentRating/Amount.interface';

export interface Surcharges {
    SurchargeType: string;
    Description: string;
    Amount: Amount;
}
