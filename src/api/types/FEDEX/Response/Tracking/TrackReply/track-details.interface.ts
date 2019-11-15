import { FedexNotificationResponse } from '../../../Notification/fedex-notification-response.interface';
import { StatusDetail } from './status-detail.interface';
import { OtherIdentifiers } from './other-identifier.interface';
import { Service } from './service.interface';
import { ShipmentWeight } from './shipment-weight.interface';
import { DatesOrTimes } from './dates-or-times.interface';
import { DeliveryOptionEligibilityDetails } from './delivery-option-eligibility-details.interface';
import { Address } from './address.interface';
import { Events } from './events.interface';
import { Location } from './location.interface';

export interface TrackDetails {
    Notification: FedexNotificationResponse[];
    TrackingNumber: string;
    TrackingNumberUniqueIdentifier: string;
    StatusDetail: StatusDetail;
    CarrierCode: string;
    OperatingCompanyOrCarrierDescription: string;
    OtherIdentifiers: OtherIdentifiers;
    Service: Service;
    ShipmentWeight: ShipmentWeight;
    Packaging: {
        Type: string;
        Description: string;
    };
    PackageSequenceNumber: number;
    PackageCount: number;
    ShipmentContentPieceCount: number;
    PackageContentPieceCount: number;
    CreatorSoftwareId: string;
    SpecialHandlings: {
        Type: string;
        Description: string;
        PaymentType: string;
    };
    Payments: {
        Classification: string;
        Type: string;
        Description: string;
    };
    ShipperAddress: Address;
    DatesOrTimes: DatesOrTimes;
    DestinationAddress: Address;
    ActualDeliveryAddress: Address;
    DeliveryLocationType: string;
    DeliveryLocationDescription: string;
    DeliveryAttempts: number;
    DeliverySignatureName: string;
    LastUpdatedDestinationAddress: Location;
    TotalUniqueAddressCountInConsolidation: number;
    AvailableImages: {
        Type: string;
    };
    NotificationEventsAvailable: string;
    DeliveryOptionEligibilityDetails: DeliveryOptionEligibilityDetails;
    Events: Events[];
}
