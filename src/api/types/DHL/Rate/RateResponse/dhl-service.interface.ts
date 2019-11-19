import { TotalNet } from './dhl-total-net.interface';
import { Charges } from './dhl-charges.interface';
export interface RateServiceObject {
    '@type': string;
    TotalNet: TotalNet;
    Charges: Charges;
    DeliveryTime: string;
    CutoffTime: string;
    NextBusinessDayInd: string;
}
