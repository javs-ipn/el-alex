import { Amount } from './Amount.interface';

export interface Surcharges {
    SurchargeType: string;
    Description: string;
    Amount: Amount;
}
