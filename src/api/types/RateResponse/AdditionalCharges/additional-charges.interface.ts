import { ChargesDetail } from '../charges-detail.interface';

export interface AdditionalCharges {
    serviceName: string;
    chargesDetail: ChargesDetail[];
}
