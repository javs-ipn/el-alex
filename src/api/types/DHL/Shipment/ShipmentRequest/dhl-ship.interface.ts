import { Recipient } from './dhl-recipient.interface';
import { Shipper } from './dhl-shipper.interface';

export interface Ship {
    Shipper: Shipper;
    Recipient: Recipient;
}
