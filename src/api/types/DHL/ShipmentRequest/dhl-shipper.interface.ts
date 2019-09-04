import { Address } from './dhl-address.interface';
import { Contact } from './dhl-contact.interface';

export interface Shipper {
    Contact: Contact;
    Address: Address;
}
