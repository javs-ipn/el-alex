import { Address } from './address.interface';

export interface Events  {
    Timestamp: Date;
    EventType: string;
    EventDescription: string;
    Address: Address;
    ArrivalLocation: string;
}
