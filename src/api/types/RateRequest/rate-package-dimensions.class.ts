import { IsDefined, IsNumber, IsPositive, Min } from 'class-validator';

export class RatePackageDimensions {

    @IsDefined()
    @IsNumber()
    @IsPositive()
    public weight: number;

    @IsDefined()
    @IsNumber()
    @Min(1)
    public length: number;

    @IsDefined()
    @IsNumber()
    @Min(1)
    public width: number;

    @IsDefined()
    @IsNumber()
    @Min(1)
    public height: number;
}
