import { FedexNotificationResponse } from '../Notification/fedex-notification-response.interface';
import { TransactionDetail } from '../TransactionDetail/transaction-detail.interface';
import { SOAPServiceVersion } from '../Credentials/SoapServiceVersion/soap-service-version.interface';

export interface FedexResponseBase {
    $: { xmlns: string; };
    HighestSeverity: string;
    Notifications: FedexNotificationResponse[];
    TransactionDetail: TransactionDetail;
    Version: SOAPServiceVersion;
}
