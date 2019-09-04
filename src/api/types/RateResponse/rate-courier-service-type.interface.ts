import { ChargesDetail } from './charges-detail.interface';

export  interface RateCourierServiceType {
    rateId: number;
    service: string;
    currency: string;
    amount: number;
    chargesDetail: ChargesDetail[];
}
