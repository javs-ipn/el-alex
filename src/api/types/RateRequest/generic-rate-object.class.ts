import {
    ArrayMaxSize,
    IsArray,
    IsDefined,
    IsEnum,
    IsString,
    ValidateNested
    } from 'class-validator';
import { CourierEnum } from '../enums/courier-enum';
import { RateLocation } from './rate-location.class';
import { RatePackage } from './rate-package.class';
import { Type } from 'class-transformer';

export class GenericRateObject {

    @IsString()
    @IsDefined()
    public tenantId: string;

    @IsArray()
    @ArrayMaxSize(1, { message: 'As a work in progress only accept one package' })
    @ValidateNested()
    @Type(() => RatePackage)
    public packages: RatePackage[];

    @ValidateNested()
    @Type(() => RateLocation)
    public shipperLocation: RateLocation;

    @ValidateNested()
    @Type(() => RateLocation)
    public recipientLocation: RateLocation;

    @IsArray()
    @IsEnum(CourierEnum, { each: true, message: `Must be a valid enum value valid options ${Object.keys(CourierEnum)}` })
    public preferredCouriers: string[];
}
