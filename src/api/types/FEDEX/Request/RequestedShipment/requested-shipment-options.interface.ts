import { RequestedPackageLineItem } from '../RequestedPackageLineItem/requested-package-line-item.interface';
import { TotalInsured } from '../TotalInsured/total-insured.interfaces';
import { ShipmentData } from '../../Shipment/ShipmentData/shipment-data.class';

export interface RequestedShipmentOptions {
    accountNumber: string;
    currencyCode?: string;
    dropoffType: string;
    insured?: TotalInsured;
    isForeign?: boolean;
    isShipmentRequest: boolean;
    packageType: string;
    recipientLocation: ShipmentData;
    requestedPackageLineItems: RequestedPackageLineItem[];
    serviceType?: string;
    shipperLocation: ShipmentData;
    totalWeight: number;
}
