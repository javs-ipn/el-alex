import { Address } from './dhl-rate-address.interface';

export interface Ship {
    Shipper: Address;
    Recipient: Address;
}
