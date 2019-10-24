import { AdditionalCharge } from './rate-additional-charge.interface';

export interface RateInfo {
    serviceName: string;
    serviceDesc: string;
    deliveryType: string;
    totalAmount: number;
    deliveryTimeHours: string;
    additionalCharges?: AdditionalCharge[];
}
