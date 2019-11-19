import { ServiceDescription } from '../ServiceDescription/service-description.interface';
import { RatedShipmentDetails } from './rated-shipment-details.interface';

export interface RateReplyDetail {
    ServiceType: string;
    ServiceDescription: ServiceDescription;
    PackagingType: string;
    DestinationAirportId: string;
    IneligibleForMoneyBackGuarantee: string;
    OriginServiceArea: string;
    DestinationServiceArea: string;
    SignatureOption: string;
    ActualRateType: string;
    RatedShipmentDetails: RatedShipmentDetails[];
}
