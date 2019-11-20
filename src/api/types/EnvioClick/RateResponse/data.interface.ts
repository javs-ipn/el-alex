import {Package} from './package.interface';
import {Insurance} from './insurance.interface';
import {Rate} from './rate.interface';

export interface Data {
    package: Package;
    insurance: Insurance;
    originZipCode: string;
    destinationZipCode: string;
    rates: Rate[];
    idCarriersNoWsResult: string;
}
