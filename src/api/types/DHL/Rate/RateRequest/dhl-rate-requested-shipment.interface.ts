import { Ship } from './dhl-rate-ship.interface';
import { RequestedPackages } from './dhl-rate-requested-packages.interface';

export interface RequestedShipment {
    DropOffType: string;
    ShipTimestamp: string;
    UnitOfMeasurement: string;
    Content: string;
    PaymentInfo: string;
    NextBusinessDay: string;
    Account: string;
    Ship: Ship;
    Packages: RequestedPackages;
}
