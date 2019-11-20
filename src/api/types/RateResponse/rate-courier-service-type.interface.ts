import { ChargesDetail } from './charges-detail.interface';

export interface RateCourierServiceType {
    rateId: number;
    serviceName: string;
    currency: string;
    amount: number;
    estimatedDeliveryDate: string;
    chargesDetail: ChargesDetail[];
}
