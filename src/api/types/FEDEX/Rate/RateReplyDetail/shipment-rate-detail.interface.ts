import { Amount } from '../../Response/Shipment/ShipmentRating/Amount.interface';
import { Surcharges } from './surcharges.interface';

export interface ShipmentRateDetail {
    RateType: string;
    RateScale: string;
    RateZone: string;
    PricingCode: string;
    RatedWeightMethod: string;
    CurrencyExchangeRate: {
        FromCurrency: string;
        IntoCurrency: string;
        Rate: number
    };
    DimDivisor: number;
    FuelSurchargePercent: 7.0;
    TotalBillingWeight: {
        Units: string;
        Value: number
    };
    TotalBaseCharge: Amount;
    TotalFreightDiscounts: Amount;
    TotalNetFreight: Amount;
    TotalSurcharges: Amount;
    TotalNetFedExCharge: Amount;
    TotalTaxes: Amount;
    TotalNetCharge: Amount;
    TotalRebates: Amount;
    TotalDutiesAndTaxes: Amount;
    TotalAncillaryFeesAndTaxes: Amount;
    TotalDutiesTaxesAndFees: Amount;
    TotalNetChargeWithDutiesAndTaxes: Amount;
    Surcharges: Surcharges[];
    Taxes: {
        TaxType: string;
        Description: string;
        Amount: Amount;
    };
}
