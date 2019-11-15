import { Amount } from './Amount.interface';

export interface Taxes {
    TaxType: string;
    Description: string;
    Amount: Amount;
}
