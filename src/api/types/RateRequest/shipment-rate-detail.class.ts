import { Content } from '../enums/content-enum';
import { DropOff } from '../enums/dropoff-enum';
import { IsEnum, IsString } from 'class-validator';

export class ShipmentRateDetail {

    @IsString()
    @IsEnum(Content, { message: `Must be a valid enum value valid options ${Object.keys(Content)}`})
    public contentType: Content;

    @IsString()
    @IsEnum(DropOff, { message: `Must be a valid enum value valid options ${Object.keys(DropOff)}`})
    public dropOffType: DropOff;

}
