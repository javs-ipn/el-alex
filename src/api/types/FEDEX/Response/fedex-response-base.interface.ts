import { FedexNotificationResponse } from './Notification/fedex-notification-response.interface';
import { ServiceVersion } from '../../Credential/Fedex/ServiceVersion/service-version.interface';

export interface FedexResponseBase {
    $: { xmlns: string; };
    HighestSeverity: string;
    Notifications: FedexNotificationResponse[];
    TransactionDetail: TransactionDetail;
    Version: ServiceVersion;
}
