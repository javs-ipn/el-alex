import { IsDefined, IsNumber, Min, IsPositive } from 'class-validator';
import { DimensionsInfoOptions } from './dimensions-info-options.interface';

export class DimensionsInfo {

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

    constructor(dimensionOptions?: DimensionsInfoOptions) {
        if (dimensionOptions) {
            this.weight = dimensionOptions.weight;
            this.length = dimensionOptions.length;
            this.width = dimensionOptions.width;
            this.height = dimensionOptions.height;
        }
    }
}
