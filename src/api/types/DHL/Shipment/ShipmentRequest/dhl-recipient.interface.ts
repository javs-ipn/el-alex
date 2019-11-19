import { Address } from './dhl-address.interface';
import { Contact } from './dhl-contact.interface';

export interface Recipient {
    Contact: Contact;
    Address: Address;
}
