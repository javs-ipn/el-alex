import { RateCourierServiceType } from './rate-courier-service-type.interface';

export interface CourierRate {
    name: string;
    services: RateCourierServiceType[];
}
