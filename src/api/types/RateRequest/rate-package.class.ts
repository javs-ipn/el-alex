import { Currency } from '../enums/currency-enum';
import {
    IsEnum,
    IsNumber,
    IsPositive,
    IsString,
    MaxLength,
    ValidateNested
    } from 'class-validator';
import { RatePackageDimensions } from './rate-package-dimensions.class';
import { ShipmentRateDetail } from './shipment-rate-detail.class';
import { Type } from 'class-transformer';

export class RatePackage {

    @ValidateNested()
    @Type(() => ShipmentRateDetail)
    public shipmentRateDetail: ShipmentRateDetail;

    @ValidateNested()
    @Type(() => RatePackageDimensions)
    public packageInfo: RatePackageDimensions;

    @IsString()
    @MaxLength(30)
    public description: string;

    @IsNumber()
    @IsPositive()
    public customsValue: number;

    @IsEnum(Currency, {  message: `Must be a valid enum value valid options ${Object.keys(Currency)}` })
    public currency: string;
}
