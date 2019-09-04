import { InternationalDetail } from './dhl-international-detail.interface';
import { Packages } from './dhl-packages';
import { Ship } from './dhl-ship.interface';
import { ShipmentInfo } from './dhl-shipment-info.interface';
import { SpecialServices } from './dhl-special-services.interface';

export interface RequestedShipment {

    ShipmentInfo: ShipmentInfo;
    ShipTimestamp: string;
    PaymentInfo: string;
    InternationalDetail: InternationalDetail;
    Ship: Ship;
    Packages: Packages;
    ManifestBypass: string;
    SpecialServices?: SpecialServices;
}
