import {
    IsDefined,
    IsString,
    IsNumber,
    IsPositive
    } from 'class-validator';
import { GenericContactInfo } from '../ContactInfo/generic-contact-info.class';

export class GenericShipmentRequest {

    @IsString()
    @IsDefined()
    public tenantId: string;

    @IsNumber()
    @IsPositive()
    @IsDefined()
    public rateId: number;

    @IsString()
    @IsDefined()
    public externalId: string;

    public shipperInfo: GenericContactInfo;
    public recipientInfo: GenericContactInfo;
}
