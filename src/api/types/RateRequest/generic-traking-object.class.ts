import { Courier } from '../enums/courier-enum';
import {
    IsArray,
    IsDefined,
    IsEnum,
    IsString,
} from 'class-validator';
import { LevelDetail } from '../enums/event-enum';

export class GenericTrakingObject {

    @IsString()
    @IsDefined()
    public tenantId: string;

    @IsString()
    @IsDefined()
    public waybill: string;

    @IsString()
    @IsEnum(LevelDetail, { each: true, message: `Must be a valid enum value valid option ${Object.keys(LevelDetail)}` })
    public levelDetail: string;

    @IsArray()
    @IsEnum(Courier, { each: true, message: `Must be a valid enum value valid options ${Object.keys(Courier)}` })
    public preferredCouriers: string[];
}
