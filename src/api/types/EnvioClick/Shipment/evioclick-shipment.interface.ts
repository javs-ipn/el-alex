import { ShipmentPackage } from './envioclick-shipment-package.interface';
import { RecipientAddress } from './envioclick-recipient-address.interface';
import { ShipperAddress } from './envioclick-shipper-address.interface';

export interface ShipmentRequestEnvioClick {
    idRate: number;
    myShipmentReference: string;
    requestPickup: boolean;
    pickupDate: string;
    insurance: boolean;
    thermalLabel: boolean;
    package: ShipmentPackage;
    origin: ShipperAddress;
    destination: RecipientAddress;
}
