import { Notification } from './dhl-notification.interface';
import { RateServiceObject } from './dhl-service.interface';

export interface Provider {
    '@code': string;
    Notification: Notification[];
    Service: RateServiceObject[];
}
