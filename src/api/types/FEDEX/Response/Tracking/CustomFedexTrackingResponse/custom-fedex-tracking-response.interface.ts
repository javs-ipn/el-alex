import { Events } from '../TrackReply/events.interface';
import { Location } from '../TrackReply/location.interface';
import { StatusDetail } from '../TrackReply/status-detail.interface';

export interface CustomFedexTrackingResponse  {
    DeliverySignatureName: string;
    LastUpdatedDestinationAddress: Location;
    ActualDeliveryAddress: Location;
    NotificationEventsAvailable: string;
    DestinationAddress: Location;
    StatusDetail: StatusDetail;
    Events: Events[];
}
