import { MaxLength, IsString, IsEmail, IsNotEmpty, IsDefined, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class ShipmentData {

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    public name: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MaxLength(45)
    public corporateName: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    public neighborhood: string;

    @IsDefined()
    @IsNumber()
    public neighborhoodId: number;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MaxLength(25)
    public phoneNumber: string;

    @IsDefined()
    @IsEmail()
    @MaxLength(50)
    public email: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    public fullAddress: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    public secondaryAddress: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    public referenceAddress: string;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    public streetName: string;

    @IsOptional()
    @IsString()
    @MaxLength(15)
    public streetNumber: string;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    public betweenStreet: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MaxLength(35)
    public city: string;

    @IsDefined()
    @IsNumber()
    public cityId: number;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MaxLength(12)
    public zipcode: string;

    @IsDefined()
    @IsBoolean()
    public isForeign: boolean;

    @IsDefined()
    @IsString()
    public countryCode: string;

    @IsDefined()
    @IsString()
    public countryCurrencyCode: string;
}
