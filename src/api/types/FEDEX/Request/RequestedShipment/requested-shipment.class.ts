import { RequestedPackageLineItem } from '../RequestedPackageLineItem/requested-package-line-item.interface';
import { RequestedShipmentOptions } from './requested-shipment-options.interface';
import { TotalInsured } from '../TotalInsured/total-insured.interfaces';
import { ShipmentData } from '../../Shipment/ShipmentData/shipment-data.class';
export class RequestedShipment {

    public accountNumber: string;
    public currencyCode?: string;
    public dropoffType: string;
    public insured?: TotalInsured;
    public isForeign?: boolean;
    public isShipmentRequest: boolean;
    public packageType: string;
    public recipientLocation: ShipmentData;
    public requestedPackageLineItems: RequestedPackageLineItem[];
    public serviceType?: string;
    public shipperLocation: ShipmentData;
    public totalWeight: number;

    constructor(requestedShipmentOptions?: RequestedShipmentOptions) {
        if (requestedShipmentOptions) {
            this.accountNumber = requestedShipmentOptions.accountNumber;
            this.currencyCode = requestedShipmentOptions.currencyCode;
            this.dropoffType = requestedShipmentOptions.dropoffType;
            this.insured = requestedShipmentOptions.insured;
            this.isForeign = requestedShipmentOptions.isForeign;
            this.isShipmentRequest = requestedShipmentOptions.isShipmentRequest;
            this.packageType = requestedShipmentOptions.packageType;
            this.recipientLocation = requestedShipmentOptions.recipientLocation;
            this.requestedPackageLineItems = requestedShipmentOptions.requestedPackageLineItems;
            this.serviceType = requestedShipmentOptions.serviceType;
            this.shipperLocation = requestedShipmentOptions.shipperLocation;
            this.totalWeight = requestedShipmentOptions.totalWeight;
        }
    }
}
