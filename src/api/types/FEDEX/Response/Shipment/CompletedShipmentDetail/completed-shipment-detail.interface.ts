import { MasterTrackingId } from '../MasterTrackingId/master-tracking-id.interface';
import { OperationalDetail } from '../OperationalDetail/operational-detail.interface';
import { ShipmentRating } from '../ShipmentRating/shipment-rating.interface';
import { DocumentRequirements } from '../DocumentRequirements/document-requirements.interface';
import { CompletedPackageDetails } from '../CompletedPackageDetails/completed-package-details.interface';

export interface CompletedShipmentDetail {
    UsDomestic: string;
    CarrierCode: string;
    MasterTrackingId: MasterTrackingId;
    ServiceTypeDescription: string;
    PackagingDescription: string;
    OperationalDetail: OperationalDetail;
    ShipmentRating: ShipmentRating;
    DocumentRequirements: DocumentRequirements;
    CompletedPackageDetails: CompletedPackageDetails;
}
