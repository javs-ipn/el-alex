import { IsString, MaxLength, IsEmail } from 'class-validator';

export class GenericContactInfo {

    @IsString()
    @MaxLength(90)
    public streetLines1: string;

    @IsString()
    @MaxLength(25)
    public reference: string;

    @IsEmail()
    public email: string;

    @IsString()
    public phoneNumber: string;

    @IsString()
    public corporateName: string;

    @IsString()
    public contactName: string;

}
