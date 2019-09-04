import { IsString, MaxLength, MinLength } from 'class-validator';

export class RateLocation {

    @IsString()
    @MinLength(5)
    @MaxLength(6)
    public zipcode: string;

    @IsString()
    public cityName: string;

    @IsString()
    public countryISOCode: string;

}
