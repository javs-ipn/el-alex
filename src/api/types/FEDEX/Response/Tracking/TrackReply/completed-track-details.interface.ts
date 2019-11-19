import { FedexNotificationResponse } from '../../../Notification/fedex-notification-response.interface';
import { TrackDetails } from './track-details.interface';

export interface CompletedTrackDetails {
    HighestSeverity: string;
    Notifications: FedexNotificationResponse[];
    DuplicateWaybill: boolean;
    MoreData: boolean;
    TrackDetailsCount: number;
    TrackDetails: TrackDetails[];
}
