import {Package} from './package.interface';
import {Origin} from './origin.interface';
import {Destination} from './destination.interface';

export interface Data {
    package: Package;
    origin: Origin;
    destination: Destination;
    guide: string;
    url: string;
    tracker: string;
    idOrder: number;
}
