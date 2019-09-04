import { Courier } from '../enums/courier-enum';
import {
    IsArray,
    IsDefined,
    IsEnum,
    IsString,
    ValidateNested,
    ArrayMaxSize
} from 'class-validator';
import { RatePackage } from './rate-package.class';
import { Type } from 'class-transformer';
import { RateLocation } from './rate-location.class';

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
    @IsEnum(Courier, { each: true, message: `Must be a valid enum value valid options ${Object.keys(Courier)}` })
    public preferredCouriers: string[];
}
